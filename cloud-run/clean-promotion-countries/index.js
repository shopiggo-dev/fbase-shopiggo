
/**
 * Cloud Run (HTTP) — CJ promotions country cleaner
 *
 * Reads docs from `promotions-cj-linksearch`, infers/normalizes targeted
 * countries, and upserts into:
 *  - promotions-cj-linksearch-clean            (production writes)
 *  - promotions-cj-linksearch-clean-preview    (preview writes when dryRun=true&preview=true)
 *
 * Query params:
 *  - batchSize: number (default 400)
 *  - limit: number (max docs to process; default unlimited)
 *  - dryRun: "true" | "false" (default "false")
 *  - preview: "true" | "false" (default "false") -> if true AND dryRun=true, writes to preview collection
 *  - id: string (process a single doc ID only)
 *
 * Examples:
 *  GET https://<service-url>/?dryRun=true&id=<docId>
 *  GET https://<service-url>/?dryRun=true&preview=true&id=<docId>
 *  GET https://<service-url>/?batchSize=400
 */

const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
const countries = require("i18n-iso-countries");

try {
  if (!admin.apps.length) admin.initializeApp();
} catch (_) {}

const db = admin.firestore();

try {
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
} catch (_) {}

/** ---------- Region & country sets ---------- */
const SPECIAL_TOKEN_TO_ALPHA2 = {
  UK: "GB",
  "U.K.": "GB",
  GB: "GB",
  ENG: "GB",
  UAE: "AE",
  KSA: "SA",
  USA: "US",
  "U.S.": "US",
  US: "US",
  CA: "CA",
  EU: "EU",
  EEA: "EEA"
};

const EU27 = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
  "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
];

const EUROPE_WIDE = [
  ...EU27,
  "AL","AD","BA","BY","CH","FO","GB","GG","GI","IM","IS","JE","LI","MC",
  "MD","ME","MK","NO","RU","SM","RS","SJ","UA","VA","XK"
];

const LATAM = [
  "MX","BZ","CR","SV","GT","HN","NI","PA",
  "AR","BO","BR","CL","CO","EC","GY","PE","PY","SR","UY","VE",
  "BS","BB","CU","DM","DO","GD","HT","JM","LC","TT","KN"
];

const APAC = [
  "AF","AM","AZ","BD","BT","BN","KH","CN","GE","HK","IN","ID","JP","KZ",
  "KG","LA","MO","MY","MV","MN","MM","NP","PK","PH","SG","KR","LK","TW",
  "TJ","TH","TL","TM","UZ","VN",
  "AU","NZ","PG","FJ","VU","WS","TO","SB","KI","TV","NR","MH","FM","PW"
];

const MIDDLE_EAST = ["AE","BH","CY","EG","IR","IQ","IL","JO","KW","LB","OM","PS","QA","SA","SY","TR","YE"];
const NORTH_AFRICA = ["DZ","EG","LY","MA","TN","SD","SS","EH"];
const AFRICA = [
  "DZ","AO","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CD","CG","CI","DJ",
  "EG","GQ","ER","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW",
  "ML","MR","MU","MA","MZ","NA","NE","NG","RW","RE","ST","SN","SC","SL","SO",
  "ZA","SS","SD","SZ","TZ","TG","TN","UG","ZM","ZW","EH"
];

const MENA = Array.from(new Set([...MIDDLE_EAST, ...NORTH_AFRICA]));
const EMEA = Array.from(new Set([...EUROPE_WIDE, ...MIDDLE_EAST, ...AFRICA]));
const DACH = ["DE","AT","CH"];
const BENELUX = ["BE","NL","LU"];
const NORDICS = ["DK","FI","IS","NO","SE"];
const ANZ = ["AU","NZ"];
const GCC = ["AE","SA","KW","QA","OM","BH"];
const IBERIA = ["ES","PT"];
const CEE = ["PL","CZ","SK","HU","RO","BG","HR","SI","EE","LV","LT"];
const SEA = ["BN","KH","ID","LA","MY","MM","PH","SG","TH","TL","VN"];

/** ---------- Utilities ---------- */
const toTitle = (s) =>
  s.replace(/\s+/g, " ")
   .trim()
   .toLowerCase()
   .replace(/\b[a-z]/g, (c) => c.toUpperCase());

function codeToName(alpha2) {
  if (alpha2 === "XK") return "Kosovo";
  const n = countries.getName(alpha2, "en");
  return n || null;
}

function nameToCode(nameLike) {
  const code = countries.getAlpha2Code(nameLike, "en");
  return code || null;
}

function normalizeMaybeCode(token) {
  if (!token) return null;
  const t = token.trim().toUpperCase();

  if (SPECIAL_TOKEN_TO_ALPHA2[t]) {
    const v = SPECIAL_TOKEN_TO_ALPHA2[t];
    return v.length === 2 ? v : null;
  }

  if (/^[A-Z]{2}$/.test(t) && codeToName(t)) return t;
  return null;
}

/** Infer from strings like "footshop.gr", "example.co.uk" */
function inferFromDomain(name) {
  if (!name) return [];
  const matches = name.match(/([a-z0-9-]+\.)+([a-z.]{2,})/gi) || [];
  const picks = new Set();

  for (const host of matches) {
    const parts = host.toLowerCase().split(".");
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2] || "";
    const ccMap = { uk: "GB", au: "AU" };

    if (ccMap[last]) picks.add(ccMap[last]);
    else if (last.length === 2) {
      const code = last.toUpperCase();
      if (codeToName(code)) picks.add(code);
    } else if (["uk","au"].includes(secondLast) && ["co","com","net","org"].includes(last)) {
      const code = secondLast.toUpperCase();
      if (codeToName(code)) picks.add(code);
    }
  }

  return Array.from(picks);
}

/** Parse advertiser/program name for embedded country hints */
function inferFromName(name) {
  if (!name) return [];

  const out = new Set();
  const up = name.toUpperCase();

  // Global
  if (/\b(GLOBAL|WORLDWIDE|INTERNATIONAL)\b/.test(up)) return ["GLOBAL"];

  // Regions & clusters
  if (/\bEMEA\b/.test(up)) EMEA.forEach((c) => out.add(c));
  if (/\bEUROPE(AN)?\b/.test(up)) EUROPE_WIDE.forEach((c) => out.add(c));
  if (/\bEU\b/.test(up)) EU27.forEach((c) => out.add(c));
  if (/\b(LATAM|LATIN AMERICA)\b/.test(up)) LATAM.forEach((c) => out.add(c));
  if (/\bAPAC\b/.test(up)) APAC.forEach((c) => out.add(c));
  if (/\bMENA\b/.test(up)) MENA.forEach((c) => out.add(c));
  if (/\bDACH\b/.test(up)) DACH.forEach((c) => out.add(c));
  if (/\bBENELUX\b/.test(up)) BENELUX.forEach((c) => out.add(c));
  if (/\bNORDICS?\b/.test(up)) NORDICS.forEach((c) => out.add(c));
  if (/\bANZ\b/.test(up)) ANZ.forEach((c) => out.add(c));
  if (/\bGCC\b/.test(up)) GCC.forEach((c) => out.add(c));
  if (/\bIBERIA(N)?\b/.test(up)) IBERIA.forEach((c) => out.add(c));
  if (/\bCEE\b/.test(up)) CEE.forEach((c) => out.add(c));
  if (/\b(S(OUTH)?\s?E(AST)?\s?ASIA|SEA)\b/.test(up)) SEA.forEach((c) => out.add(c));
  if (/\b(N(ORTH)?\s?AMERICA(N|S)?|NAMER|NA)\b/.test(up)) ["US","CA","MX"].forEach((c) => out.add(c));
  if (/\bAMERICAS?\b/.test(up)) [...new Set(["US","CA","MX", ...LATAM])].forEach((c) => out.add(c));

  // Common short forms
  if (/\bUK\b/.test(up)) out.add("GB");
  if (/\bUAE\b/.test(up)) out.add("AE");
  if (/\bKSA\b/.test(up)) out.add("SA");
  if (/\bUS(A)?\b/.test(up)) out.add("US");
  if (/\b(CANADA|CA)\b/.test(up)) out.add("CA");
  if (/\b(MEXICO|MX)\b/.test(up)) out.add("MX");
  if (/\b(UK|GB)\b/.test(up)) out.add("GB");
  if (/\b(IE|IRELAND)\b/.test(up)) out.add("IE");

  // Two-letter ISO codes like "DE & AT"
  const twoLetterHits = up.match(/(?<![A-Z])[A-Z]{2}(?![A-Z])/g) || [];
  for (const tok of twoLetterHits) {
    const code = normalizeMaybeCode(tok);
    if (code) out.add(code);
  }

  // Full country names as tokens
  const words = up.split(/[\s&/|,;:\-_.]+/).filter(Boolean);
  for (const w of words) {
    if (["THE","AND","OF","SHOP","STORE","ONLINE","EUROPE","LATAM","APAC","EMEA","MENA","GLOBAL"].includes(w)) continue;
    if (SPECIAL_TOKEN_TO_ALPHA2[w] && SPECIAL_TOKEN_TO_ALPHA2[w].length === 2) { out.add(SPECIAL_TOKEN_TO_ALPHA2[w]); continue; }
    const maybeName = toTitle(w);
    const code = nameToCode(maybeName);
    if (code) out.add(code);
  }

  // ccTLD/domain clues
  inferFromDomain(name).forEach((c) => out.add(c));

  return Array.from(out);
}

/** Convert a mix of codes/names into canonical country names */
function normalizeCountryList(mixed) {
  const out = new Set();

  for (let raw of mixed || []) {
    if (!raw) continue;
    let s = String(raw).trim();

    // split comma/semicolon lists
    if (/[;,]/.test(s)) {
      s.split(/[;,]/).forEach((piece) => mixed.push(piece));
      continue;
    }

    // ignore region markers here; expanded earlier
    const regionKey = SPECIAL_TOKEN_TO_ALPHA2[s.toUpperCase()];
    if (regionKey && regionKey.length !== 2) continue;

    // Try as alpha-2
    const asCode = normalizeMaybeCode(s);
    if (asCode) {
      const name = codeToName(asCode);
      if (name) out.add(name);
      continue;
    }

    // Try as full name
    const asName = toTitle(s);
    const code = nameToCode(asName);
    if (code) {
      const name = codeToName(code);
      if (name) out.add(name);
      continue;
    }
  }

  return Array.from(out).sort((a, b) => a.localeCompare(b));
}

/** Pull possible geo fields from source doc */
function extractRawGeoFromDoc(data) {
  const candidateKeys = [
    "targetedCountries",
    "targeted_countries",
    "countries",
    "country_codes",
    "countryCodes",
    "targetCountries",
    "targetedGeo",
    "geo",
    "country",
    "country_code"
  ];
  for (const k of candidateKeys) {
    if (k in data) return data[k];
  }
  return null;
}

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v && typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Core per-document cleaning */
function cleanDocGeo(docData) {
  const fromDoc = extractRawGeoFromDoc(docData);
  const advertiserName = firstNonEmpty(
    docData.advertiserName,
    docData.advertiser,
    docData.programName,
    docData.name,
    docData.retailerName,
    docData.brand
  ) || "";

  const raw = [];
  if (Array.isArray(fromDoc)) raw.push(...fromDoc);
  else if (typeof fromDoc === "string") raw.push(fromDoc);

  // Expand from advertiser/program text
  const inferred = inferFromName(advertiserName);

  // If “GLOBAL”, return just Global
  if (inferred.includes("GLOBAL")) {
    return { countries: ["Global"], notes: "Global inferred from name" };
  }

  // Expand region tokens seen in raw
  const regionAdds = new Set();
  for (const v of raw) {
    const t = String(v).trim().toUpperCase();
    if (t === "EU") EU27.forEach((c) => regionAdds.add(c));
    if (t === "EMEA") EMEA.forEach((c) => regionAdds.add(c));
    if (t === "APAC") APAC.forEach((c) => regionAdds.add(c));
    if (t === "LATAM" || t === "LATIN AMERICA") LATAM.forEach((c) => regionAdds.add(c));
    if (t === "MENA") MENA.forEach((c) => regionAdds.add(c));
    if (t === "EUROPE") EUROPE_WIDE.forEach((c) => regionAdds.add(c));
    if (t === "DACH") DACH.forEach((c) => regionAdds.add(c));
    if (t === "BENELUX") BENELUX.forEach((c) => regionAdds.add(c));
    if (t === "NORDICS") NORDICS.forEach((c) => regionAdds.add(c));
    if (t === "ANZ") ANZ.forEach((c) => regionAdds.add(c));
    if (t === "GCC") GCC.forEach((c) => regionAdds.add(c));
    if (t === "IBERIA") IBERIA.forEach((c) => regionAdds.add(c));
    if (t === "CEE") CEE.forEach((c) => regionAdds.add(c));
    if (t === "SEA") SEA.forEach((c) => regionAdds.add(c));
  }

  const combined = [...raw, ...inferred, ...Array.from(regionAdds)];
  let clean = normalizeCountryList(combined);

  if (clean.length === 0) {
    clean = normalizeCountryList(["US", "CA"]);
    return { countries: clean, notes: "Defaulted to US & Canada" };
  }

  return { countries: clean, notes: "Derived from doc + name inference" };
}

/** Paged scanner */
async function* scanCollectionPaged(collRef, batchSize, limitDocs) {
  let last = null;
  let processed = 0;

  while (true) {
    let q = collRef.orderBy(admin.firestore.FieldPath.documentId()).limit(batchSize);
    if (last) q = q.startAfter(last);

    const snap = await q.get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      yield doc;
      processed++;
      if (limitDocs && processed >= limitDocs) return;
    }

    last = snap.docs[snap.docs.length - 1].id;
  }
}

/** HTTP entry point */
functions.http("cleanPromotions", async (req, res) => {
  try {
    const batchSize = Math.max(1, parseInt(String(req.query.batchSize || "400"), 10));
    const limit = req.query.limit ? Math.max(1, parseInt(String(req.query.limit), 10)) : null;
    const dryRun = String(req.query.dryRun || "false").toLowerCase() === "true";
    const preview = String(req.query.preview || "false").toLowerCase() === "true";
    const singleId = req.query.id ? String(req.query.id) : null;

    const SRC_COLL = "promotions-cj-linksearch";
    const DST_COLL = "promotions-cj-linksearch-clean";
    const PREVIEW_COLL = "promotions-cj-linksearch-clean-preview";

    const src = db.collection(SRC_COLL);

    // Decide destination collection
    const targetColl = dryRun
      ? (preview ? PREVIEW_COLL : null)
      : DST_COLL;

    if (singleId) {
      const d = await src.doc(singleId).get();
      if (!d.exists) return res.status(404).json({ error: "Doc not found", id: singleId });

      const { countries: cleanCountries, notes } = cleanDocGeo(d.data() || {});
      const payload = {
        ...d.data(),
        cleanTargetedCountries: cleanCountries,
        cleaningMeta: {
          version: 2,
          cleanedAt: admin.firestore.FieldValue.serverTimestamp(),
          notes
        }
      };

      if (targetColl) await db.collection(targetColl).doc(d.id).set(payload, { merge: true });

      return res.json({
        mode: "single",
        id: d.id,
        dryRun,
        preview,
        wroteTo: targetColl || null,
        cleanTargetedCountries: cleanCountries,
        notes
      });
    }

    let processed = 0, written = 0, skipped = 0;

    for await (const doc of scanCollectionPaged(src, batchSize, limit)) {
      processed++;
      const { countries: cleanCountries, notes } = cleanDocGeo(doc.data() || {});

      if (!cleanCountries || cleanCountries.length === 0) { skipped++; continue; }

      if (targetColl) {
        await db.collection(targetColl).doc(doc.id).set(
          {
            ...doc.data(),
            cleanTargetedCountries: cleanCountries,
            cleaningMeta: {
              version: 2,
              cleanedAt: admin.firestore.FieldValue.serverTimestamp(),
              notes
            }
          },
          { merge: true }
        );
        written++;
      }
    }

    return res.json({
      mode: "batch",
      dryRun,
      preview,
      wroteTo: targetColl || null,
      batchSize,
      limit,
      processed,
      written,
      skipped
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

    