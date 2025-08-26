
// functions/src/lib/cj.ts
'use server';
import type { Product } from './data';
import { buildCjDeepLink } from './cj-url';

const cjToken = process.env.CJ_PERSONAL_ACCESS_TOKEN;
const CJ_GRAPHQL_URL = 'https://product-search.api.cj.com/query';

if (!cjToken) {
    console.warn("CJ Personal Access Token not found. CJ integration will be disabled.");
}

// This function queries the CJ GraphQL API for products
export async function getProductsFromCJ(query: string, advertiserId: string, linkId: string): Promise<Product[]> {
    if (!cjToken) {
        console.error("Cannot query CJ API: Personal Access Token is not configured.");
        return [];
    }
    
    const publisherId = process.env.CJ_PID;
    if (!publisherId) {
        console.error("Cannot query CJ API: CJ_PID (Website ID/Property ID) is not configured in .env.");
        return [];
    }

    const graphqlQuery = {
        query: `
            query ProductSearch($query: String, $advertiserIds: [ID!], $pid: ID!) {
              products(
                keywords: [$query],
                advertiserIds: $advertiserIds,
                limit: 50
              ) {
                resultList {
                  advertiserId
                  advertiserName
                  title
                  id
                  description
                  imageLink
                  link
                  price {
                    amount
                    currency
                  }
                  salePrice {
                    amount
                    currency
                  }
                }
              }
            }
        `,
        variables: {
            query: query,
            advertiserIds: [advertiserId],
            pid: publisherId
        }
    };

    try {
        console.log(`Querying CJ GraphQL for "${query}" from advertiser ID "${advertiserId}"`);
        const response = await fetch(CJ_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cjToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery),
            signal: AbortSignal.timeout(30000), // 30-second timeout
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`CJ GraphQL API call failed with status ${response.status}: ${errorBody}`);
            throw new Error(`CJ API request failed with status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        
        if (jsonResponse.errors) {
            console.error('CJ GraphQL API returned errors:', jsonResponse.errors);
            return [];
        }

        const products = jsonResponse.data?.products?.resultList || [];
        console.log(`Received ${products.length} products from CJ for "${query}" from advertiser ${advertiserId}`);
        return products.map((productNode: any) => mapCjDataToProduct(productNode, publisherId, linkId));

    } catch (error) {
        console.error(`Error fetching products from CJ for query "${query}" and advertiser ${advertiserId}:`, error);
        return [];
    }
}

// Maps the raw CJ GraphQL data to our standard Product interface
function mapCjDataToProduct(item: any, publisherId: string, linkId: string): Product {
    const price = item.salePrice?.amount ?? item.price?.amount ?? 0;

    const destinationUrl = item.link;

    const productUrl = buildCjDeepLink({
        pid: publisherId,
        linkId: linkId,
        destinationUrl: destinationUrl
    });

    return {
        id: `cj-${item.advertiserId}-${item.id}`,
        title: item.title || 'No Title Provided',
        price: price,
        storeName: item.advertiserName,
        imageURL: item.imageLink || '',
        productURL: productUrl,
        category: 'Beauty', // Using a placeholder for now
        description: item.description || 'No description available.',
    };
}
