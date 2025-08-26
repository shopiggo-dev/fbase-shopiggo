
/**
 * Cloud Run (Function) — CJ Advertiser Lookup -> Firestore
 *
 * This function fetches advertiser data from the CJ Advertiser Lookup API
 * and upserts it into a specified Firestore collection ('retailer-cj-fb').
 *
 * It is designed to be triggered by an HTTP POST request, which can specify
 * which advertisers to fetch (e.g., all 'joined' advertisers). This is
 * intended to be run daily via Cloud Scheduler to keep advertiser info fresh.
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

// ---- Env Vars (placeholders to be replaced) ----
// WARNING: Hard-coding secrets is not recommended. Use environment variables for production.
const CJ_REQUESTOR_CID = 'YOUR_CJ_REQUESTOR_CID_HERE';
const CJ_PERSONAL_ACCESS_TOKEN = 'YOUR_CJ_PERSONAL_ACCESS_TOKEN_HERE';
const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || '(default)';

const RETAILER_CJ_FB_COLLECTION = 'retailer-cj-fb';
const MAX_PAGES = Number(process.env.MAX_PAGES || 50);
const PAGE_SIZE = Number(process.env.PAGE_SIZE || 100);

// ---------- Helpers ----------
function arrify(x) { return !x ? [] : Array.isArray(x) ? x : [x]; }
function num(v) { return (v === undefined || v === null || v === '') ? null : Number(v); }
function nowIso() { return new Date().toISOString(); }
function slugify(s) {
  if (!s) return '';
  return s.toString().toLowerCase()
    .normalize('NFKD').replace(/[^\w\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-')
    .slice(0, 120);
}

/**
 * Extracts all documented fields from a CJ advertiser XML node.
 * @param {object} adv - The advertiser node from the parsed XML.
 * @returns {object} A structured object with all advertiser data.
 */
function extractAllAdvertiserFields(adv) {
    const primaryCategory = adv['primary-category'] ? {
        parent: adv['primary-category'].parent ?? null,
        child: adv['primary-category'].child ?? null
    } : null;

    const actions = arrify(adv?.actions?.action).map(ac => ({
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

    const linkTypes = arrify(adv?.['link-types']?.['link-type']).filter(Boolean);

    return {
        advertiserId: String(adv['advertiser-id']),
        accountStatus: adv['account-status'] ?? null,
        sevenDayEpc: num(adv['seven-day-epc']),
        threeMonthEpc: num(adv['three-month-epc']),
        language: adv['language'] ?? null,
        advertiserName: adv['advertiser-name'] ?? null,
        programUrl: adv['program-url'] ?? null,
        relationshipStatus: adv['relationship-status'] ?? null,
        mobileSupported: adv['mobile-supported'] ?? null,
        mobileTrackingCertified: adv['mobile-tracking-certified'] ?? null,
        cookielessTrackingEnabled: adv['cookieless-tracking-enabled'] ?? null,
        networkRank: num(adv['network-rank']),
        primaryCategory,
        performanceIncentives: adv['performance-incentives'] ?? null,
        actions,
        linkTypes,
        lastSyncedAt: nowIso()
    };
}


// ---------- Main Function ----------
functions.http('cjAdvertiserFb', async (req, res) => {
    if (getApps().length === 0) {
      initializeApp();
    }
    const db = getFirestore(undefined, FIRESTORE_DATABASE_ID);
    const parser = new XMLParser({
      ignoreAttributes: true,
      parseAttributeValue: true,
    });

  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Use POST or GET' });
    }
    if (!CJ_REQUESTOR_CID || CJ_REQUESTOR_CID === 'YOUR_CJ_REQUESTOR_CID_HERE' || !CJ_PERSONAL_ACCESS_TOKEN || CJ_PERSONAL_ACCESS_TOKEN === 'YOUR_CJ_PERSONAL_ACCESS_TOKEN_HERE') {
      const errorMessage = 'Missing CJ_REQUESTOR_CID or CJ_PERSONAL_ACCESS_TOKEN. Please add your credentials to the placeholders in index.js.';
      console.error(errorMessage);
      return res.status(500).json({ error: errorMessage });
    }

    const advertiserIds = (req.body?.advertiserIds ?? req.query?.advertiserIds ?? '').toString().trim();
    const keywords = (req.body?.keywords ?? req.query?.keywords ?? '').toString().trim();
    const advertiserName = (req.body?.advertiserName ?? req.query?.advertiserName ?? '').toString().trim();

    if (!advertiserIds && !keywords && !advertiserName) {
      return res.status(400).json({ error: 'Provide one of advertiserIds, keywords, or advertiserName' });
    }

    let page = 1;
    let collectedAdvertisers = [];
    let firstRawSample = "";

    console.log(`Starting CJ Advertiser sync for query: ${advertiserIds || keywords || advertiserName}`);

    // --- Pagination Loop ---
    while (page <= MAX_PAGES) {
      const url = new URL('https://advertiser-lookup.api.cj.com/v2/advertiser-lookup');
      url.searchParams.set('requestor-cid', CJ_REQUESTOR_CID);
      url.searchParams.set('records-per-page', String(PAGE_SIZE));
      url.searchParams.set('page-number', String(page));

      if (advertiserIds) {
        url.searchParams.set('advertiser-ids', advertiserIds.replace(/\s+/g,''));
      } else if (keywords) {
        url.searchParams.set('keywords', keywords);
      } else if (advertiserName) {
        url.searchParams.set('advertiser-name', advertiserName);
      }

      console.log(`Fetching page ${page}...`);
      const resp = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${CJ_PERSONAL_ACCESS_TOKEN}`, 'Accept': 'application/xml' }
      });

      const rawXml = await resp.text();
      if (!firstRawSample) firstRawSample = rawXml.slice(0, 500);

      if (!resp.ok) {
        console.error('CJ API error:', resp.status, rawXml.slice(0,500));
        return res.status(502).json({ error: 'CJ API request failed', status: resp.status, details: rawXml.slice(0,500) });
      }

      const parsed = parser.parse(rawXml);
      const pageArr = arrify(parsed?.['cj-api']?.advertisers?.advertiser);

      if (pageArr.length === 0) break; // No more results
      
      collectedAdvertisers = collectedAdvertisers.concat(pageArr);
      
      if (pageArr.length < PAGE_SIZE) break; // Last page
      
      page++;
    }

    console.log(`Found a total of ${collectedAdvertisers.length} advertisers.`);

    if (collectedAdvertisers.length === 0) {
      return res.status(200).json({ message: 'No advertisers returned for the given query.', count: 0, sample: firstRawSample });
    }

    // --- Firestore Batch Upsert ---
    const batch = db.batch();
    let upsertCount = 0;

    for (const adv of collectedAdvertisers) {
      const structuredData = extractAllAdvertiserFields(adv);
      const advertiserNameSlug = slugify(structuredData.advertiserName || 'unknown');
      const docId = `cj-${advertiserNameSlug}-${structuredData.advertiserId}`;
      const docRef = db.collection(RETAILER_CJ_FB_COLLECTION).doc(docId);
      
      batch.set(docRef, structuredData, { merge: true });
      upsertCount++;
    }

    await batch.commit();
    console.log(`Successfully upserted ${upsertCount} documents into '${RETAILER_CJ_FB_COLLECTION}'.`);

    return res.status(200).json({
      message: `Successfully synced ${upsertCount} advertisers to Firestore.`,
      count: upsertCount,
      collection: RETAILER_CJ_FB_COLLECTION,
      database: FIRESTORE_DATABASE_ID
    });

  } catch (e) {
    console.error("Critical error in cjAdvertiserFb function:", e);
    return res.status(500).json({ error: e?.message || 'An unknown error occurred.' });
  }
});
