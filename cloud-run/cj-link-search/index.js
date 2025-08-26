
/**
 * Cloud Run (Function) — CJ Link Search -> Firestore
 *
 * This function fetches all promotional links for all "joined" advertisers
 * from the CJ Link Search API and stores the raw data in the 'promotions-cj-linksearch' collection.
 *
 * It can be filtered by providing a `days` parameter in the POST body or as a URL query,
 * e.g., {"days": 7} or ?days=7, to fetch links that started within that timeframe.
 *
 * This function is designed to be triggered by Cloud Scheduler via an HTTP POST request.
 */

const functions = require('@google-cloud/functions-framework');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { XMLParser } = require('fast-xml-parser');

// ---- Env Vars ----
// WARNING: Hard-coding secrets is not recommended. Use environment variables for production.
const CJ_PERSONAL_ACCESS_TOKEN = 'YOUR_CJ_PERSONAL_ACCESS_TOKEN_HERE';
const CJ_PID = 'YOUR_CJ_WEBSITE_ID_PID_HERE'; // <-- ADD YOUR PID HERE

const FIRESTORE_DATABASE_ID = '(default)';
const PROMOTIONS_COLLECTION = 'promotions-cj-linksearch';
const PAGE_SIZE = 100;
const BATCH_SIZE = 400; // Firestore batch write limit is 500 operations
const API_DELAY_MS = 5000; // 5-second delay to stay under the limit
const MAX_RETRIES = 30; // Maximum number of retries for rate-limited requests

// ---------- Main Function ----------
functions.http('cjLinkSearch', async (req, res) => {
    // --- INITIALIZATION ---
    if (getApps().length === 0) {
      initializeApp();
    }
    const db = getFirestore(undefined, FIRESTORE_DATABASE_ID);
    const parser = new XMLParser({ ignoreAttributes: true, parseAttributeValue: true });

    // ---------- HELPERS (moved inside handler) ----------
    function arrify(x) { return !x ? [] : Array.isArray(x) ? x : [x]; }
    function nowIso() { return new Date().toISOString(); }
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    function slugify(s) {
        if (!s) return '';
        return s.toString().toLowerCase()
            .normalize('NFKD').replace(/[^\w\s-]/g,'')
            .trim().replace(/\s+/g,'-').replace(/-+/g,'-')
            .slice(0,120);
    }
    
    // --- CORE LOGIC ---
    /**
     * Fetches all promotional links for all joined advertisers.
     * Handles pagination and an optional start date with robust retries.
     */
    async function getAllJoinedLinks(startDate) {
        let allLinks = [];
        let page = 1;
        let hasMorePages = true;
        const url = new URL('https://link-search.api.cj.com/v2/link-search');
        url.searchParams.set('website-id', CJ_PID);
        url.searchParams.set('advertiser-ids', 'joined');
        url.searchParams.set('records-per-page', String(PAGE_SIZE));

        if (startDate) {
            url.searchParams.set('start-date', startDate);
        }

        while (hasMorePages) {
            url.searchParams.set('page-number', String(page));
            console.log(`Fetching page ${page} of links...`);

            let retries = 0;
            let resp;
            
            while (retries < MAX_RETRIES) {
                resp = await fetch(url.toString(), {
                    headers: { 'Authorization': `Bearer ${CJ_PERSONAL_ACCESS_TOKEN}` }
                });

                if (resp.ok) {
                    break; // Success, exit the retry loop
                }

                if (resp.status === 429) {
                    retries++;
                    const waitTime = 10000 * Math.pow(2, retries - 1); // Exponential backoff: 10s, 20s, 40s...
                    console.warn(`Rate limit hit on page ${page}. Waiting ${waitTime / 1000} seconds to retry (${retries}/${MAX_RETRIES})...`);
                    await sleep(waitTime);
                } else {
                    // For other non-ok statuses, break and handle the error below
                    break;
                }
            }

            if (!resp.ok) {
                 console.error(`CJ Link Search API error on page ${page}:`, resp.status, await resp.text());
                 throw new Error(`Failed to fetch links from CJ API after ${retries} retries.`);
            }

            const xmlText = await resp.text();
            const parsed = parser.parse(xmlText);
            const pageLinks = arrify(parsed?.['cj-api']?.links?.link);

            if (pageLinks.length === 0) {
                 hasMorePages = false;
                 break;
            }
            
            allLinks = allLinks.concat(pageLinks);
            
            if (pageLinks.length < PAGE_SIZE) {
                hasMorePages = false;
            }

            page++;
            await sleep(API_DELAY_MS); // Wait before the next call
        }
        return allLinks;
    }


    // --- MAIN EXECUTION ---
    try {
        if (req.method !== 'POST' && req.method !== 'GET') {
            return res.status(405).json({ error: 'Use POST or GET' });
        }
        if (!CJ_PERSONAL_ACCESS_TOKEN || CJ_PERSONAL_ACCESS_TOKEN === 'YOUR_CJ_PERSONAL_ACCESS_TOKEN_HERE' || !CJ_PID || CJ_PID === 'YOUR_CJ_WEBSITE_ID_PID_HERE') {
            const errorMessage = 'Missing CJ API credentials. Please add your PAT and PID to the placeholders in index.js.';
            console.error(errorMessage);
            return res.status(500).json({ error: errorMessage });
        }

        console.log("Starting CJ Link Search sync...");
        
        const days = req.query?.days || req.body?.days;
        let startDate = null;
        if (days && !isNaN(parseInt(days))) {
            const date = new Date();
            date.setDate(date.getDate() - parseInt(days));
            startDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            console.log(`Filtering for links that started in the last ${days} days (since ${startDate}).`);
        }

        const allLinks = await getAllJoinedLinks(startDate);
        if (allLinks.length === 0) {
            console.log("No new links found for the given criteria.");
            return res.status(200).json({ message: 'No new links found.' });
        }
        console.log(`Found a total of ${allLinks.length} links to process.`);

        // Batch write all promotion documents in chunks to avoid size limits
        for (let i = 0; i < allLinks.length; i += BATCH_SIZE) {
            const chunk = allLinks.slice(i, i + BATCH_SIZE);
            const promoBatch = db.batch();
            
            chunk.forEach(link => {
                if (link && link['link-id']) {
                    const advertiserNameSlug = slugify(link['advertiser-name']);
                    // CORRECTED a readable, unique ID
                    const docId = `cj-${advertiserNameSlug}-${link['link-id']}`; 
                    const ref = db.collection(PROMOTIONS_COLLECTION).doc(docId);
                    const data = {
                        ...link,
                        updatedAt: nowIso(),
                        expireAt: link['promotion-end-date'] ? new Date(link['promotion-end-date']) : null,
                    };
                    promoBatch.set(ref, data, { merge: true });
                }
            });
            
            await promoBatch.commit();
            console.log(`Upserted chunk of ${chunk.length} documents into '${PROMOTIONS_COLLECTION}'.`);
        }
        
        console.log(`Finished upserting all ${allLinks.length} documents into '${PROMOTIONS_COLLECTION}'.`);

        console.log("CJ Link Search sync finished.");
        return res.status(200).json({
            message: 'Successfully synced CJ promotional links to Firestore.',
            totalLinksSynced: allLinks.length,
            filter: startDate ? `Since ${startDate}` : 'None',
        });

    } catch (e) {
        console.error("Critical error in cjLinkSearch function:", e);
        return res.status(500).json({ error: e?.message || 'An unknown error occurred.' });
    }
});
