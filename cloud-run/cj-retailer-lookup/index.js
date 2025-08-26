
/**
 * Cloud Run (Function) — CJ Advertiser Lookup -> Firestore (raw + unified)
 *
 * Collections:
 *  - retailer-cj/{docId}             // raw CJ-per-retailer, docId = cj-<slug(name)>-<advertiserId>
 *  - retailers-unified/{canonicalId} // unified retailer with networks blocks
 *
 * POST body examples:
 *  {"advertiserIds":"joined"}
 *  {"advertiserIds":"notjoined"}
 *  {"advertiserIds":"1234567,7654321"}
 *  {"keywords":"beauty"}
 *  {"advertiserName":"sephora"}
 */

const functions = require('@google-cloud/functions-framework');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { XMLParser } = require('fast-xml-parser');

// ---- Env Vars (set in Console -> Variables & Secrets) ----
// WARNING: Hard-coding secrets is not recommended. Use environment variables for production.
const CJ_REQUESTOR_CID = 'YOUR_CJ_REQUESTOR_CID_HERE'; // Or '7662116'
const CJ_PERSONAL_ACCESS_TOKEN = 'YOUR_CJ_PERSONAL_ACCESS_TOKEN_HERE';
const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || '(default)';

const RETAILER_CJ_COLLECTION = process.env.RETAILER_CJ_COLLECTION || 'retailer-cj';
const UNIFIED_COLLECTION = process.env.UNIFIED_COLLECTION || 'retailers-unified';
const MAX_PAGES = Number(process.env.MAX_PAGES || 20);
const PAGE_SIZE = Number(process.env.PAGE_SIZE || 100);

// ---------- helpers ----------
function arrify(x){ return !x ? [] : Array.isArray(x) ? x : [x]; }
function num(v){ return (v===undefined||v===null||v==='') ? null : Number(v); }
function nowIso(){ return new Date().toISOString(); }

function slugify(s) {
  if (!s) return '';
  return s.toString().toLowerCase()
    .normalize('NFKD').replace(/[^\w\s-]/g,'')   // drop accents/punct
    .trim().replace(/\s+/g,'-').replace(/-+/g,'-')  // spaces -> dash
    .slice(0,120); // keep doc IDs short & sortable
}

function domainFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./i,'').toLowerCase();
  } catch { return null; }
}

/** Convert ISO-2 code to full country name (covers 130+ via Intl) */
function countryNameFromISO2(code) {
  if (!code || code.length !== 2) return null;
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    return dn.of(code.toUpperCase()) || null;
  } catch { return null; }
}

/**
 * Infer full country name from domain ccTLD.
 * ex: example.co.uk -> "United Kingdom"; example.de -> "Germany"
 * This is a best-effort mainCountry; Link Search enrichment will add definitive otherCountries.
 */
function inferMainCountryFullFromDomain(domain) {
  if (!domain) return null;
  const parts = domain.split('.');
  const last = parts[parts.length - 1];            // e.g., "uk", "de", "com"
  if (/^[a-z]{2}$/i.test(last)) {
    const full = countryNameFromISO2(last);
    if (full) return full;
  }
  // Try second-level (e.g., "co.uk" → "uk")
  if (parts.length >= 3) {
    const maybe = parts[parts.length - 2];
    if (/^[a-z]{2}$/i.test(maybe)) {
      const full = countryNameFromISO2(maybe);
      if (full) return full;
    }
  }
  return null;
}

function pickAdvertisersNode(parsed) {
  const api = parsed?.['cj-api'];
  if (api?.advertisers) return api.advertisers;
  if (parsed?.advertisers) return parsed.advertisers;
  return null;
}

// map the CJ <advertiser> into a complete JS object containing ALL fields we see
function extractAllFields(a) {
  // Preserve everything CJ gives us (including nested arrays) using explicit copies
  const primaryCategory = a['primary-category'] ? {
    parent: a['primary-category'].parent ?? null,
    child: a['primary-category'].child ?? null
  } : null;

  // actions → array of { name, type, id, commission: { default, itemlist[] } }
  const actions = arrify(a?.actions?.action).map(ac => ({
    name: ac?.name ?? null,
    type: ac?.type ?? null,
    id: ac?.id != null ? String(ac.id) : null,
    commission: {
      default: ac?.commission?.default ?? null,
      itemlist: arrify(ac?.commission?.itemlist).map(it => ({
        id: it?.id != null ? String(it.id) : null,
        name: it?.name ?? null,
        value: (typeof it === 'object' && 'name' in it) ? (it?.['#text'] ?? it?._text ?? null) : null
      }))
    }
  }));

  const linkTypes = arrify(a?.['link-types']?.['link-type']).filter(Boolean);

  return {
    advertiserId: String(a['advertiser-id']),
    accountStatus: a['account-status'] ?? null,
    sevenDayEpc: num(a['seven-day-epc']),
    threeMonthEpc: num(a['three-month-epc']),
    language: a['language'] ?? null,
    advertiserName: a['advertiser-name'] ?? null,
    programUrl: a['program-url'] ?? null,
    relationshipStatus: a['relationship-status'] ?? null,
    mobileSupported: a['mobile-supported'] ?? null,
    mobileTrackingCertified: a['mobile-tracking-certified'] ?? null,
    cookielessTrackingEnabled: a['cookieless-tracking-enabled'] ?? null,
    networkRank: num(a['network-rank']),
    primaryCategory,
    performanceIncentives: a['performance-incentives'] ?? null,
    actions,
    linkTypes
  };
}

// RAW doc for retailer-cj (store ALL fields + a few helper fields)
function buildRawDoc(aAll) {
  const domain = domainFromUrl(aAll.programUrl);
  return {
    origin: 'cj',
    advertiserId: aAll.advertiserId,
    advertiserName: aAll.advertiserName,
    accountStatus: aAll.accountStatus,
    sevenDayEpc: aAll.sevenDayEpc,
    threeMonthEpc: aAll.threeMonthEpc,
    language: aAll.language,
    programUrl: aAll.programUrl,
    relationshipStatus: aAll.relationshipStatus,
    mobileSupported: aAll.mobileSupported,
    mobileTrackingCertified: aAll.mobileTrackingCertified,
    cookielessTrackingEnabled: aAll.cookielessTrackingEnabled,
    networkRank: aAll.networkRank,
    primaryCategory: aAll.primaryCategory, // {parent, child}
    performanceIncentives: aAll.performanceIncentives,
    actions: aAll.actions,                 // full structure
    linkTypes: aAll.linkTypes,             // array
    // placeholders to be enriched by Link Search job:
    markets: {
      // CHANGED: full country name (or null) inferred from domain
      mainCountry: inferMainCountryFullFromDomain(domain) || null,
      otherCountries: [] // Link Search job will union full names here too
    },
    // convenience
    categories: (aAll.primaryCategory
      ? [aAll.primaryCategory.parent, aAll.primaryCategory.child].filter(Boolean)
      : []),
    updatedAt: nowIso()
  };
}

// Unified doc upsert
function buildUnifiedUpsert(aAll) {
  const domain = domainFromUrl(aAll.programUrl);
  const canonicalId = slugify(domain || aAll.advertiserName || aAll.advertiserId);

  const networks_cj = {
    network: 'cj',
    externalId: aAll.advertiserId,
    relationshipStatus: aAll.relationshipStatus || null,
    epc: { '7d': aAll.sevenDayEpc ?? null, '90d': aAll.threeMonthEpc ?? null },
    programUrl: aAll.programUrl || null,
    networkRank: aAll.networkRank ?? null,
    mobileSupported: aAll.mobileSupported ?? null,
    mobileTrackingCertified: aAll.mobileTrackingCertified ?? null,
    cookielessTrackingEnabled: aAll.cookielessTrackingEnabled ?? null,
    linkTypes: aAll.linkTypes || [],
    actions: aAll.actions || [],
    lastUpdated: nowIso()
  };

  return {
    canonicalId,
    brand: aAll.advertiserName || canonicalId,
    website: aAll.programUrl || null,
    domains: domain ? [domain] : [],
    categories: (aAll.primaryCategory
      ? [aAll.primaryCategory.parent, aAll.primaryCategory.child].filter(Boolean)
      : []),
    sources: ['cj'],
    markets: {
      // CHANGED: full country name (or null) inferred from domain
      mainCountry: inferMainCountryFullFromDomain(domain) || null,
      otherCountries: [] // will be filled by Link Search enrichment with full names
    },
    networks: {
      cj: networks_cj,
      impact: {},     // placeholder for future
      rakuten: {},    // placeholder for future
      flexoffers: {}  // placeholder for future
    },
    lastSyncedAt: nowIso()
  };
}

// ---------- main ----------
functions.http('cjAdvertiser', async (req, res) => {
    // Initialization moved inside the handler
    if (getApps().length === 0) {
      initializeApp();
    }
    const db = getFirestore(undefined, FIRESTORE_DATABASE_ID);
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseAttributeValue: true,
      attributeNamePrefix: ""
    });

    async function upsertRetailerCjDoc(aAll) {
        const nameSlug = slugify(aAll.advertiserName || 'unknown');
        const docId = `cj-${nameSlug}-${aAll.advertiserId}`;
        const ref = db.collection(RETAILER_CJ_COLLECTION).doc(docId);
        const data = buildRawDoc(aAll);
        await ref.set(data, { merge: true });
        return docId;
    }

    async function upsertUnifiedDoc(aAll) {
        const up = buildUnifiedUpsert(aAll);
        const ref = db.collection(UNIFIED_COLLECTION).doc(up.canonicalId);
        await db.runTransaction(async tx => {
            const snap = await tx.get(ref);
            const before = snap.exists ? snap.data() : {};
            // Merge networks.cj fresh each time; keep other networks intact if they exist
            const merged = {
            ...before,
            canonicalId: up.canonicalId,
            brand: up.brand || before.brand || up.canonicalId,
            website: up.website || before.website || null,
            domains: Array.from(new Set([...(before.domains||[]), ...(up.domains||[])])).filter(Boolean),
            categories: Array.from(new Set([...(before.categories||[]), ...(up.categories||[])])).filter(Boolean),
            sources: Array.from(new Set([...(before.sources||[]), 'cj'])),
            markets: {
                // keep existing mainCountry if already set, otherwise new inferred full name
                mainCountry: before?.markets?.mainCountry ?? up.markets.mainCountry ?? null,
                otherCountries: before?.markets?.otherCountries || []
            },
            networks: {
                impact: before?.networks?.impact || {},
                rakuten: before?.networks?.rakuten || {},
                flexoffers: before?.networks?.flexoffers || {},
                cj: up.networks.cj
            },
            lastSyncedAt: nowIso()
            };
            tx.set(ref, merged, { merge: true });
        });
        return up.canonicalId;
    }

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
    if (!CJ_REQUESTOR_CID || CJ_REQUESTOR_CID === 'YOUR_CJ_REQUESTOR_CID_HERE' || !CJ_PERSONAL_ACCESS_TOKEN || CJ_PERSONAL_ACCESS_TOKEN === 'YOUR_CJ_PERSONAL_ACCESS_TOKEN_HERE') {
      const errorMessage = 'Missing CJ_REQUESTOR_CID or CJ_PERSONAL_ACCESS_TOKEN. Please add your credentials to the placeholders in index.js.';
      console.error(errorMessage);
      return res.status(500).json({ error: errorMessage });
    }

    const advertiserIds = (req.body?.advertiserIds ?? '').toString().trim(); // joined | notjoined | "1,2,3"
    const keywords      = (req.body?.keywords ?? '').toString().trim();
    const advertiserName= (req.body?.advertiserName ?? '').toString().trim();

    if (!advertiserIds && !keywords && !advertiserName) {
      return res.status(400).json({ error: 'Provide one of advertiserIds | keywords | advertiserName' });
    }

    let page = 1, collected = [], firstRawSample = "";

    while (page <= MAX_PAGES) {
      const url = new URL('https://advertiser-lookup.api.cj.com/v2/advertiser-lookup');
      url.searchParams.set('requestor-cid', CJ_REQUESTOR_CID);
      url.searchParams.set('records-per-page', String(PAGE_SIZE));
      url.searchParams.set('page-number', String(page));
      if (advertiserIds) {
        const isNumericList=/^[0-9,\s]+$/.test(advertiserIds);
        url.searchParams.set('advertiser-ids', isNumericList ? advertiserIds.replace(/\s+/g,'') : advertiserIds);
      } else if (keywords) {
        url.searchParams.set('keywords', keywords);
      } else if (advertiserName) {
        url.searchParams.set('advertiser-name', advertiserName);
      }

      const resp = await fetch(url, {
        headers: { 'Authorization': `Bearer ${CJ_PERSONAL_ACCESS_TOKEN}`, 'Accept': 'application/xml' }
      });
      const raw = await resp.text();
      if (!firstRawSample) firstRawSample = raw.slice(0, 500);
      if (!resp.ok) {
        console.error('CJ error', resp.status, raw.slice(0,500));
        return res.status(502).json({ error:'CJ error', status:resp.status, sample:raw.slice(0,500) });
      }

      const parsed = parser.parse(raw);
      const advNode = pickAdvertisersNode(parsed);
      const pageArr = arrify(advNode?.advertiser);
      if (pageArr.length === 0) break;
      collected = collected.concat(pageArr);
      if (pageArr.length < PAGE_SIZE) break;
      page++;
    }

    if (collected.length === 0) {
      return res.status(200).json({ message:'No advertisers returned', count:0, sample:firstRawSample });
    }

    // Write both collections
    let rawCount=0, unifiedCount=0;
    for (const adv of collected) {
      const all = extractAllFields(adv);
      await upsertRetailerCjDoc(all); rawCount++;
      await upsertUnifiedDoc(all);    unifiedCount++;
    }

    return res.status(200).json({
      message: 'Upserted CJ advertisers into retailer-cj and retailers-unified',
      count: collected.length,
      pagesPulled: page,
      rawCollection: RETAILER_CJ_COLLECTION,
      unifiedCollection: UNIFIED_COLLECTION,
      database: FIRESTORE_DATABASE_ID
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
});
