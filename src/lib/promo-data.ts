
// src/lib/promo-data.ts

export type Promotion = {
  advertiserId?: string;
  advertiserName?: string;
  clickUrl?: string;
  description?: string;
  destination?: string;
  linkCodeHtml?: string;
  linkCodeJavascript?: string;
  linkId?: string;
  linkName?: string;
  promotionEndDate?: string;
  promotionStartDate?: string;
  promotionType?: string;
  categories?: string[];
  linkType?: string;
  creativeHeight?: number;
  category?: string;
};

// This data is now fetched dynamically, but kept for type reference.
export const hardcodedPromotions: Promotion[] = [];
