
// src/lib/deals.ts
import { collection, getDocs, limit as fbLimit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Promotion } from "@/lib/promo-data";

function mapDeal(raw: any, id: string): Promotion | null {
    if (!raw?.clickUrl) return null;

    return {
        advertiserName: raw['advertiser-name'] || "Retailer",
        clickUrl: String(raw.clickUrl),
        description: raw.description || raw['link-name'] || "",
        linkCodeHtml: raw['link-code-html'] || null,
        linkId: id,
        linkName: raw['link-name'] || "GoCoupon",
        promotionEndDate: raw['promotion-end-date'] || null,
        promotionStartDate: raw['promotion-start-date'] || null,
        promotionType: raw['promotion-type'] || 'Sale',
        linkType: raw['link-type'] || 'Banner',
        creativeHeight: raw['creative-height'] || 0,
        category: raw.category || "General",
        cleanTargetedCountries: raw.cleanTargetedCountries || [],
        couponCode: raw['coupon-code'] || null,
    };
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getDealsByCategory(categories: string[], limit: number = 20): Promise<Promotion[]> {
    if (!db) {
        throw new Error("Firestore is not initialized.");
    }
    
    const cacheKey = `deals_${categories.join('_').replace(/\s/g, '-')}_${limit}`;
    try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }
    } catch (e) {
        console.warn("Could not read from localStorage for caching:", e);
    }


    try {
        const col = collection(db, "promotions-cj-linksearch-clean");
        const q = query(
            col,
            where("category", "in", categories),
            orderBy("expireAt", "desc"),
            fbLimit(limit) 
        );
        const snap = await getDocs(q);
        
        const allDeals: Promotion[] = [];
        snap.forEach((doc) => {
            const mapped = mapDeal(doc.data(), doc.id);
            if (mapped) allDeals.push(mapped);
        });

        const dealsByAdvertiser = allDeals.reduce((acc, deal) => {
            const advertiser = deal.advertiserName || 'Unknown';
            if (!acc[advertiser]) {
                acc[advertiser] = [];
            }
            acc[advertiser].push(deal);
            return acc;
        }, {} as Record<string, Promotion[]>);

        const diversifiedDeals: Promotion[] = [];
        const advertiserNames = Object.keys(dealsByAdvertiser);
        let dealIndex = 0;

        while (diversifiedDeals.length < limit && advertiserNames.length > 0) {
            let addedInCycle = false;
            for (const name of advertiserNames) {
                if (dealsByAdvertiser[name].length > dealIndex) {
                    diversifiedDeals.push(dealsByAdvertiser[name][dealIndex]);
                    addedInCycle = true;
                    if (diversifiedDeals.length >= limit) {
                        break;
                    }
                }
            }
            dealIndex++;
            if (!addedInCycle) {
                break;
            }
        }
        
         try {
            const cachePayload = {
                timestamp: Date.now(),
                data: diversifiedDeals,
            };
            localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
        } catch (e) {
            console.warn("Could not write to localStorage for caching:", e);
        }

        return diversifiedDeals;

    } catch (e: any) {
        console.error("Error fetching deals from Firestore:", e);
        throw e;
    }
}
