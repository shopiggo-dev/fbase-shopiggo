
'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DealCard } from '@/components/shopiggo/DealCard';
import { type Promotion } from '@/lib/promo-data';
import { getDealsByCategory } from '@/lib/deals';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';

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

const DealsList = ({ categories }: { categories: string[] }) => {
    const { user, isLoaded } = useUser();
    const [deals, setDeals] = useState<Promotion[]>([]);
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
    }, [categories, dealLimit]);

    useEffect(() => {
        fetchDeals();
    }, [fetchDeals]);

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


function GuestCtaBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const hasDismissed = localStorage.getItem('hasDismissedDealsBanner');
        if (hasDismissed === 'true') {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('hasDismissedDealsBanner', 'true');
        setIsVisible(false);
    };

    if (!isLoaded || user || !isVisible) {
        return null;
    }

    return (
        <Alert className="mb-8 relative bg-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold">Unlock More Deals & Powerful Search!</AlertTitle>
            <AlertDescription>
                <Link href="/signup"><span className="font-bold underline">Create a free account</span></Link> to see up to 5x more deals and use our advanced search to find exactly what you're looking for.
            </AlertDescription>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleDismiss}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
            </Button>
        </Alert>
    );
}


function HotDealsPageComponent() {
    const [activeCategory, setActiveCategory] = useState(dealCategories[0].name);

    return (
        <div className="bg-secondary/30">
            <div className="container text-center py-16 lg:py-24">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
                    Hot Deals
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Check out the latest active deals from all your favorite retailers, organized by category.
                </p>
            </div>

            <div className="container pb-24">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
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

                    <GuestCtaBanner />

                    {dealCategories.map((cat) => (
                        <TabsContent key={cat.name} value={cat.name} forceMount className={activeCategory === cat.name ? 'block' : 'hidden'}>
                            <DealsList categories={cat.values} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}

export default function HotDealsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HotDealsPageComponent />
        </Suspense>
    )
}
