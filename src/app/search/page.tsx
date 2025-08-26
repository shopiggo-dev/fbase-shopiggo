
'use client'

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { ProductCard } from '@/components/shopiggo/ProductCard';
import { type Product, retailers, categories } from '@/lib/data';
import { Bot, Search, Loader2, Gem } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { SearchAndFilterBar } from '@/components/shopiggo/Header';
import { PixiSearchAnimation } from '@/components/shopiggo/PixiSearchAnimation';
import { Skeleton } from '@/components/ui/skeleton';
import { hardcodedPromotions, type Promotion } from '@/lib/promo-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DealCard } from '@/components/shopiggo/DealCard';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { useSearchParams } from 'next/navigation';
import { getDealsByCategory } from '@/lib/deals';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X, Sparkles } from 'lucide-react';


function GuestStorefront() {
    return (
        <>
            <div className="dark header-gradient -mt-24 pt-24 text-center">
                <div className="container py-12">
                    <div className="max-w-2xl mx-auto bg-black/20 p-8 rounded-lg backdrop-blur-sm">
                        <Gem className="h-16 w-16 mx-auto text-primary" />
                        <h1 className="mt-6 text-3xl font-bold font-headline text-white">Unlock Powerful Product Search</h1>
                        <p className="mt-2 text-primary-foreground/80">
                            Create a free account or sign in to search across hundreds of stores, compare prices, and get AI-powered recommendations.
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                             <Link href="/signup">
                                <Button size="lg" className="w-full sm:w-auto">Create a Free Account</Button>
                             </Link>
                             <Link href="/login">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-primary">Login to Your Account</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
             <div className="bg-background">
                <div className="container py-12">
                    <h2 className="text-3xl font-bold mb-8 text-center font-headline">Today's Hot Deals</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {hardcodedPromotions.slice(0, 12).map((promo, index) => (
                           <DealCard key={`${promo.linkId}-${index}`} promotion={promo} />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                         <Link href="/hot-deals">
                            <Button variant="outline">View All Deals</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

const dealCategories = [
    { name: 'Fashion & Apparel', values: ['Apparel', 'Fashion', 'Clothing & Accessories', 'Shoes'] },
    { name: 'Womens', values: ['Womens', 'women', 'Apparel', 'Fashion'] },
    { name: 'Home & Garden', values: ['Home', 'Garden', 'Furniture', 'Home Goods', 'Kitchen', 'Bed & Bath'] },
    { name: 'Health & Beauty', values: ['Health & Beauty', 'Beauty', 'Cosmetics', 'Bath & Body', 'Fragrance', 'Nutritional Supplements', 'Wellness'] },
    { name: 'Bath & Body', values: ['Bath & Body', 'Beauty', 'Cosmetics', 'Fragrance'] },
    { name: 'Electronics', values: ['Electronics', 'Computers & Electronics', 'Consumer Electronics', 'Computer Hardware'] },
    { name: 'Appliances', values: ['Appliances', 'Home Appliances', 'Kitchen Appliances'] },
    { name: 'Furniture', values: ['Furniture', 'Office', 'Home', 'Decor'] },
    { name: 'Sports & Fitness', values: ['Sporting Goods', 'Sports & Fitness', 'Apparel', 'Recreation & Leisure', 'Outdoors', 'Golf'] },
    { name: 'Jewelry', values: ['Jewelry', 'Accessories'] },
    { name: 'Pets & Pet Care', values: ['Pets', 'Pet Supplies'] },
    { name: 'Nutrition & Health', values: ['Health & Wellness', 'Nutritional Supplements', 'Health & Beauty', 'Health Food'] },
    { name: 'Travel & Experience', values: ['Air', 'Hotel', 'Travel', 'Vacation', 'Event', 'Recreation & Leisure'] },
];

const DealsList = ({ categories, deals, setDeals }: { categories: string[], deals: Promotion[], setDeals: (deals: Promotion[]) => void; }) => {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dealLimit = isLoaded ? (user ? 1000 : 200) : 200;

    const fetchDeals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedDeals = await getDealsByCategory(categories, dealLimit);
            setDeals(fetchedDeals);
        } catch (e: any) {
            console.error("Failed to fetch deals for tab:", e);
            setError("Could not load deals. The required database index might be missing.");
        } finally {
            setLoading(false);
        }
    }, [categories, dealLimit, setDeals]);

    useEffect(() => {
        if (deals.length === 0) {
            fetchDeals();
        } else {
            setLoading(false);
        }
    }, [fetchDeals, deals.length]);


    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 18 }).map((_, i) => (
                    <Skeleton key={i} className="h-[250px] w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    if (deals.length === 0) {
        return <div className="text-center py-10 text-muted-foreground bg-card rounded-lg">No deals found for this category.</div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {deals.map((promo, index) => (
                <DealCard key={`${promo.linkId}-${index}`} promotion={promo} />
            ))}
        </div>
    );
};

function DealsView({deals, setDeals}: {deals: Promotion[]; setDeals: (deals: Promotion[]) => void}) {
    const [activeCategory, setActiveCategory] = useState(dealCategories[0].name);
    const currentCategories = dealCategories.find(c => c.name === activeCategory)?.values || [];

    return (
        <div className="w-full">
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                 <h2 className="text-lg font-semibold shrink-0">Select your category:</h2>
                <Select value={activeCategory} onValueChange={setActiveCategory}>
                    <SelectTrigger className="w-full sm:w-[300px]">
                        <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {dealCategories.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <DealsList categories={currentCategories} deals={deals} setDeals={setDeals} />
        </div>
    );
}

function SearchPageComponent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [lastSearchTerm, setLastSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [dealResults, setDealResults] = useState<Promotion[]>([]);
    const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1200]);
    const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
    const [reviewRange, setReviewRange] = useState<[number, number]>([0, 150000]);
    const [sortBy, setSortBy] = useState('relevance');
    const [isPixiEnabled, setIsPixiEnabled] = useState(true);
    const [pixiResponse, setPixiResponse] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const { user, userTier, isLoaded, selectedCountry } = useUser();
    const [activeTab, setActiveTab] = useState(tab || 'products');
    
    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);
    
    const applyFilters = useCallback(() => {
        let tempProducts = [...allProducts];

        if (selectedStores.length > 0) {
            tempProducts = tempProducts.filter(p => selectedStores.includes(p.storeName));
        }

        if (selectedCategories.length > 0) {
            tempProducts = tempProducts.filter(p => selectedCategories.includes(p.category));
        }

        tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        tempProducts = tempProducts.filter(p => (p.rating ?? 0) >= ratingRange[0] && (p.rating ?? 0) <= ratingRange[1]);
        tempProducts = tempProducts.filter(p => (p.reviews ?? 0) >= reviewRange[0] && (p.reviews ?? 0) <= reviewRange[1]);
        
        if (sortBy === 'price-asc') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            tempProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            tempProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        } else if (lastSearchTerm && !isPixiEnabled) {
            tempProducts.sort((a, b) => {
                const aIndex = a.title.toLowerCase().indexOf(lastSearchTerm.toLowerCase());
                const bIndex = b.title.toLowerCase().indexOf(lastSearchTerm.toLowerCase());
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });
        }
        
        setFilteredProducts(tempProducts);
    }, [allProducts, selectedStores, selectedCategories, priceRange, ratingRange, reviewRange, sortBy, lastSearchTerm, isPixiEnabled]);


    useEffect(() => {
       applyFilters();
    }, [allProducts, applyFilters]);


    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim() || isSearching) return;

        setLastSearchTerm(searchTerm);
        setIsSearching(true);
        setPixiResponse(null);

        if (activeTab === 'products') {
            setAllProducts([]);
            setFilteredProducts([]);
            try {
                const getCjProductsFn = httpsCallable(functions, 'getCjProducts');
                const result: any = await getCjProductsFn({ query: searchTerm, advertiserId: 'joined', linkId: '12345' });
                setAllProducts(result.data as Product[]);
            } catch (error) {
                console.error("Product search failed:", error);
                setPixiResponse("There was an error searching for products. Please try again.");
            }
        }  else if (activeTab === 'deals') {
            setDealResults([]);
            try {
                const searchDealsFn = httpsCallable(functions, 'searchDeals');
                const result: any = await searchDealsFn({ searchTerm: searchTerm, country: selectedCountry.name });
                setDealResults(result.data as Promotion[]);
            } catch (error) {
                console.error("Deal search failed:", error);
                setPixiResponse("There was an error searching for deals. Please try again.");
            }
        }
        
        setIsSearching(false);
    };


    const handleStoreChange = (store: string) => {
        const newStores = selectedStores.includes(store)
            ? selectedStores.filter(s => s !== store)
            : [...selectedStores, store];
        setSelectedStores(newStores);
    }

    const handleCategoryChange = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
    }

    const renderContent = () => {
        if (isSearching) {
            return <PixiSearchAnimation searchTerm={lastSearchTerm || "hot deals"} />;
        }
    
        if (pixiResponse) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="text-primary" /> Pixi AI Response
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/90">{pixiResponse}</p>
                    </CardContent>
                </Card>
            );
        }
    
        const hasSearched = lastSearchTerm !== '';
    
        if (activeTab === 'products') {
            if (!hasSearched) {
                return (
                    <div className="text-center py-16 bg-card rounded-lg">
                        <h3 className="text-2xl font-semibold">Search for products or ask Pixi a question</h3>
                        <p className="text-muted-foreground mt-2">Find anything across hundreds of stores.</p>
                    </div>
                );
            }
            if (filteredProducts.length > 0) {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} userTier={userTier} isLoaded={isLoaded}/>
                        ))}
                    </div>
                );
            }
            return (
                <div className="text-center py-16 bg-card rounded-lg">
                    <h3 className="text-2xl font-semibold">No products found for "{lastSearchTerm}"</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                </div>
            );
        }
    
        if (activeTab === 'deals') {
             if (!hasSearched) {
                return <DealsView deals={dealResults} setDeals={setDealResults} />;
             }
             if (dealResults.length > 0) {
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {dealResults.map((promo, index) => (
                            <DealCard key={`${promo.linkId}-${index}`} promotion={promo} />
                        ))}
                    </div>
                );
             }
             return (
                <div className="text-center py-16 bg-card rounded-lg">
                    <h3 className="text-2xl font-semibold">No deals found for "{lastSearchTerm}"</h3>
                    <p className="text-muted-foreground mt-2">Try a different search term or browse categories below.</p>
                    <DealsView deals={dealResults} setDeals={setDealResults} />
                </div>
            );
        }
    
        return null;
    };


    if (!isLoaded) {
        return (
            <div className="container py-8">
                <Skeleton className="h-24 w-full" />
                 <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                     {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={`skeleton-${i}`}>
                            <Skeleton className="h-[400px]" />
                        </Card>
                    ))}
                 </div>
            </div>
        )
    }

    if (!user) {
        return <GuestStorefront />;
    }

    return (
        <>
            <div className="dark header-gradient -mt-24 pt-24">
                <SearchAndFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isPixiEnabled={isPixiEnabled}
                    setIsPixiEnabled={setIsPixiEnabled}
                    isLoading={isSearching}
                    handleSearchSubmit={handleSearchSubmit}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    selectedStores={selectedStores}
                    onStoreChange={handleStoreChange}
                    onSelectAllStores={() => setSelectedStores(retailers)}
                    onClearAllStores={() => setSelectedStores([])}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    onSelectAllCategories={() => setSelectedCategories(categories)}
                    onClearAllCategories={() => setSelectedCategories([])}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    ratingRange={ratingRange}
                    onRatingChange={setRatingRange}
                    reviewRange={reviewRange}
                    onReviewChange={setReviewRange}
                />
            </div>
            <div className='bg-background'>
                <div className="container py-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="deals">Deals</TabsTrigger>
                        </TabsList>
                        <TabsContent value="products" className="mt-6">
                            {renderContent()}
                        </TabsContent>
                        <TabsContent value="deals" className="mt-6">
                           {renderContent()}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default function SearchPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <SearchPageComponent />
        </React.Suspense>
    )
}
