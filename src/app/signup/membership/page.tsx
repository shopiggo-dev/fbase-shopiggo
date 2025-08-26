// src/app/signup/membership/page.tsx
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const membershipTiers = [
    { name: "Free", monthlyPrice: 0, annualPrice: 0, features: ["Basic multi-store search", "Limited view of Hot Deals", "Standard support"], isPopular: false },
    { name: "Basic", monthlyPrice: 9.99, annualPrice: 99.90, features: ["Everything in Free, plus:", "Pixi AI Assistant (25 queries/day)", "Unified Cart", "GoCoins Rewards (1x)", "Priority support"], isPopular: false },
    { name: "Silver", monthlyPrice: 39.99, annualPrice: 399.90, features: ["Everything in Basic, plus:", "Pixi AI Assistant (100 queries/day)", "GoCoins Rewards (1.5x)", "Set price drop alerts & get notified"], isPopular: false },
    { name: "Gold", monthlyPrice: 49.99, annualPrice: 499.90, features: ["Everything in Silver, plus:", "Unlimited Pixi AI Assistant", "GoCoins Rewards (2x)", "Advanced price change notifications", "Early access to deals"], isPopular: true },
    { name: "Platinum", monthlyPrice: 59.99, annualPrice: 599.90, features: ["Everything in Gold, plus:", "GoCoins Rewards (2.5x)", "Auto-add to cart at lowest price", "Exclusive partner offers", "Dedicated account manager"], isPopular: false },
    { name: "Diamond", monthlyPrice: 79.99, annualPrice: 799.90, features: ["Everything in Platinum, plus:", "GoCoins Rewards (3x)", "Auto-purchase at lowest price", "XR Product Viewer (AR/VR)", "Personalized shopping reports", "VIP event invitations"], isPopular: false },
];

function PlanButton({ tierName, isAnnual }: { tierName: string, isAnnual: boolean }) {
    const router = useRouter();
    const { handleTierChange } = useUser();
    const { toast } = useToast();

    const handleClick = async () => {
        if (tierName === 'Free') {
            await handleTierChange('Free');
            router.push('/search');
        } else {
             if (!isAnnual) {
                 toast({
                    title: "Promo Applied!",
                    description: "Enjoy your first 90 days on us! You will be prompted to add a payment method for after the trial.",
                });
                await handleTierChange(tierName as any);
                router.push('/signup/payment');
            } else {
                router.push('/signup/payment');
            }
        }
    };
    
    const isPopular = membershipTiers.find(t => t.name === tierName)?.isPopular;

    return (
        <Button onClick={handleClick} className="w-full" variant={isPopular ? 'default' : 'outline'}>
            {tierName === 'Free' ? 'Start with Free' : 'Choose Plan'}
        </Button>
    )
}

export default function OnboardingMembershipPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const router = useRouter();

    return (
        <div className="container py-12 lg:py-20">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">One Last Step! Choose Your Plan</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Select a plan to unlock the full power of Shopiggo, or start with our free plan.
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
                            <PlanButton tierName={tier.name} isAnnual={isAnnual} />
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between items-center mt-12 max-w-lg mx-auto">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                 <Link href="/search" className="text-sm text-muted-foreground hover:text-primary underline">
                    Skip for now, I'll decide later
                </Link>
            </div>
        </div>
    );
}
