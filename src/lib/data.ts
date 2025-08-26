
import retailerData from './retailers.json';

export interface Product {
  id: string;
  title: string;
  price: number;
  storeName: string;
  imageURL: string;
  productURL: string;
  category: 'Electronics' | 'Fashion' | 'Home Goods' | 'Groceries' | 'Beauty' | 'Furniture' | 'Automotive' | 'Pet Supplies' | 'Sporting Goods' | 'Toys & Games' | 'Books' | 'Health & Wellness' | 'Office Supplies' | 'Apparel' | 'Accessories' | 'Footwear' | 'Travel' | 'Department Store' | 'Computers & Electronics' | 'Health & Beauty' | 'Gifts & Flowers' | 'Home & Garden' | 'Clothing & Accessories' | 'Telecommunications' | 'Recreation & Leisure' | 'Art/Photo/Music' | 'Marketing' | 'Business' | 'Financial Services' | 'Games & Toys' | 'Education' | 'Sports & Fitness' | 'Jewelry' | 'Appliances' | 'Golf';
  description: string;
  rating?: number;
  reviews?: number;
}

const allRetailers = retailerData.map(r => r.retailer);
const allCategories = retailerData.flatMap(r => r.categories);
const allCountries = retailerData.flatMap(r => r.countries);

export const retailers = [...new Set(allRetailers)].sort();
export const categories = [...new Set(allCategories)].sort();
export const countries = [...new Set(allCountries)].sort((a, b) => {
    // Custom sort to handle 'Global Online' or similar, though it's not in the provided new list.
    if (a.startsWith('Global')) return -1;
    if (b.startsWith('Global')) return 1;
    return a.localeCompare(b);
});

// Create separate arrays for the homepage carousels
export const retailersCarousel = [...retailers];
export const categoriesCarousel = [...categories];
export const countriesCarousel = [...countries];


const now = new Date();

export const products: Product[] = [];


export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
}
