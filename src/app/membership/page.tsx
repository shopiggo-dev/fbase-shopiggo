// src/app/membership/page.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Loader2, TrendingUp, BadgeEuro } from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// We map tier names to their respective Stripe Price IDs from environment variables.
const priceIds = {
    Basic: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID,
    },
    Silver: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_SILVER_MONTHLY_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_SILVER_ANNUAL_PRICE_ID,
    },
    Gold: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_GOLD_MONTHLY_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_GOLD_ANNUAL_PRICE_ID,
    },
    Platinum: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PLATINUM_MONTHLY_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_PLATINUM_ANNUAL_PRICE_ID,
    },
    Diamond: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_DIAMOND_MONTHLY_PRICE_ID,
        annual: process.env.NEXT_PUBLIC_STRIPE_DIAMOND_ANNUAL_PRICE_ID,
    },
};

const membershipTiers = [
    { name: "Free", monthlyPrice: 0, annualPrice: 0, savings: 0, features: ["Basic multi-store search", "Limited view of Hot Deals", "Standard support"], isPopular: false },
    { name: "Basic", monthlyPrice: 9.99, annualPrice: 99.90, savings: 50, features: ["Everything in Free, plus:", "Pixi AI Assistant (25 queries/day)", "Unified Cart", "GoCoins Rewards (1x)", "Priority support"], isPopular: false },
    { name: "Silver", monthlyPrice: 39.99, annualPrice: 399.90, savings: 150, features: ["Everything in Basic, plus:", "Pixi AI Assistant (100 queries/day)", "GoCoins Rewards (1.5x)", "Set price drop alerts & get notified"], isPopular: false },
    { name: "Gold", monthlyPrice: 49.99, annualPrice: 499.90, savings: 250, features: ["Everything in Silver, plus:", "Unlimited Pixi AI Assistant", "GoCoins Rewards (2x)", "Advanced price change notifications", "Early access to deals"], isPopular: true },
    { name: "Platinum", monthlyPrice: 59.99, annualPrice: 599.90, savings: 500, features: ["Everything in Gold, plus:", "GoCoins Rewards (2.5x)", "Auto-add to cart at lowest price", "Exclusive partner offers", "Dedicated account manager"], isPopular: false },
    { name: "Diamond", monthlyPrice: 79.99, annualPrice: 799.90, savings: 1000, features: ["Everything in Platinum, plus:", "GoCoins Rewards (3x)", "Auto-purchase at lowest price", "XR Product Viewer (AR/VR)", "Personalized shopping reports", "VIP event invitations"], isPopular: false },
];


function CheckoutButton({ tierName, isAnnual, currentTier }: { tierName: string, isAnnual: boolean, currentTier: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const { user, handleTierChange } = useUser();
    const { toast } = useToast();

    if (!user) {
        return (
            <Link href="/signup" className="w-full">
                <Button className="w-full">
                    {tierName === 'Free' ? 'Get Started' : 'Choose Plan'}
                </Button>
            </Link>
        )
    }

    if (tierName === 'Free' || tierName === currentTier) {
        return <Button className="w-full" disabled>{tierName === currentTier ? 'Current Plan' : 'Get Started'}</Button>;
    }
    
    const handlePlanChange = async () => {
        setIsLoading(true);
        try {
            await handleTierChange(tierName as any);
             toast({
                title: "Plan Changed!",
                description: `You are now on the ${tierName} plan.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not change your plan. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const isPopular = membershipTiers.find(t => t.name === tierName)?.isPopular;

    return (
        <Button onClick={handlePlanChange} disabled={isLoading} className="w-full" variant={isPopular ? 'default' : 'outline'}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Choose Plan'}
        </Button>
    )
}


export default function MembershipPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { userTier } = useUser();

    return (
        <div className="container py-12 lg:py-20">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">Membership Plans</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Choose the plan that's right for you and unlock a new level of shopping convenience.
                </p>
                <Badge variant="destructive" className="mt-6 text-base">
                    Labor Day Promo: First 90 Days FREE on all plans! (Ends Sept 2nd)
                </Badge>
            </div>

            <div className="flex items-center justify-center gap-4 my-10">
                <Label htmlFor="billing-cycle">Monthly</Label>
                <Switch id="billing-cycle" checked={isAnnual} onCheckedChange={setIsAnnual} />
                <Label htmlFor="billing-cycle">Annual</Label>
                <span className="text-sm font-medium text-primary">(Save ~17%)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {membershipTiers.map(tier => (
                    <Card key={tier.name} className={cn("flex flex-col", tier.isPopular && "border-primary border-2 shadow-lg")}>
                        <CardHeader>
                            <CardTitle className="font-headline">{tier.name}</CardTitle>
                            <CardDescription>
                                {tier.isPopular && <span className="text-primary font-semibold">Most Popular</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-6">
                             <div className="flex items-baseline gap-2">
                                {!isAnnual && tier.name !== 'Free' ? (
                                    <>
                                        <span className="text-4xl font-bold">$0</span>
                                        <span className="text-2xl font-bold text-muted-foreground line-through">${tier.monthlyPrice.toFixed(2)}</span>
                                         <span className="text-sm font-normal text-muted-foreground">
                                            /mo for first 90 days
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-4xl font-bold">${isAnnual ? tier.annualPrice.toFixed(2) : tier.monthlyPrice.toFixed(2)}</span>
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /{isAnnual ? 'year' : 'month'}
                                        </span>
                                    </>
                                )}
                            </div>
                             {tier.savings > 0 && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-semibold">
                                        Up to ${isAnnual ? (tier.savings * 12).toLocaleString() : tier.savings}/{isAnnual ? 'year' : 'month'} in savings
                                    </span>
                                </div>
                            )}
                            <ul className="space-y-3 text-sm">
                                {tier.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="w-4 h-4 mr-2 mt-1 shrink-0 text-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <CheckoutButton tierName={tier.name} isAnnual={isAnnual} currentTier={userTier} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
