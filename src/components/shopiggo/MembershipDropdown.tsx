// src/components/shopiggo/MembershipDropdown.tsx
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

import { Gem, Crown, Shield, Medal, Star, User, Loader2, ChevronsUpDown, CheckCircle } from 'lucide-react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { Badge } from '../ui/badge';

const allTiers = [
    { name: 'Diamond', icon: <Gem className="h-5 w-5 text-blue-400" />, level: 5, monthlyPrice: 79.99, annualPrice: 799.90, features: ["GoCoins (3x)", "Auto-purchase", "XR Viewer"] },
    { name: 'Platinum', icon: <Shield className="h-5 w-5 text-gray-400" />, level: 4, monthlyPrice: 59.99, annualPrice: 599.90, features: ["GoCoins (2.5x)", "Auto-add to cart"] },
    { name: 'Gold', icon: <Crown className="h-5 w-5 text-yellow-500" />, level: 3, monthlyPrice: 49.99, annualPrice: 499.90, features: ["Unlimited Pixi AI", "GoCoins (2x)"] },
    { name: 'Silver', icon: <Medal className="h-5 w-5 text-slate-400" />, level: 2, monthlyPrice: 39.99, annualPrice: 399.90, features: ["Price drop alerts"] },
    { name: 'Basic', icon: <Star className="h-5 w-5 text-amber-600" />, level: 1, monthlyPrice: 9.99, annualPrice: 99.90, features: ["Unified Cart", "Pixi AI"] },
    { name: 'Free', icon: <User className="h-5 w-5 text-muted-foreground" />, level: 0, monthlyPrice: 0, annualPrice: 0, features: ["Basic search"] },
];

function TierMenuItem({ tier, isAnnual, currentTier, currentTierLevel, onDowngradeConfirm, onUpgradeConfirm }: { tier: (typeof allTiers)[0], isAnnual: boolean, currentTier: string, currentTierLevel: number, onDowngradeConfirm: (newTier: (typeof allTiers)[0]['name']) => void, onUpgradeConfirm: (newTier: (typeof allTiers)[0]['name']) => void }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();
    const { handleTierChange } = useUser();
    const isUpgrade = tier.level > currentTierLevel;
    const actionText = isUpgrade ? 'Upgrade' : 'Downgrade';
    const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
    const billing_cycle = isAnnual ? 'yr' : 'mo';
    let priceText = price > 0 ? `$${price.toFixed(2)}/${billing_cycle}` : 'Free';
    if (!isAnnual && price > 0) {
        priceText = "Free for 90 days";
    }

    const handleChangePlan = async () => {
        setIsLoading(true);
        try {
            await handleTierChange(tier.name as any);
            toast({
                title: "Plan Changed!",
                description: `You are now on the ${tier.name} plan.`,
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
    
    if (isUpgrade) {
        return (
            <DropdownMenuItem onClick={() => onUpgradeConfirm(tier.name as any)} disabled={isLoading} className="cursor-pointer gap-2">
                {isLoading ? <Loader2 className="animate-spin" /> : tier.icon}
                <div className="flex justify-between w-full">
                    <span>{actionText} to {tier.name}</span>
                    <span className="text-muted-foreground text-xs">{priceText}</span>
                </div>
            </DropdownMenuItem>
        )
    }

    const currentTierData = allTiers.find(t => t.level === currentTierLevel);
    const lostBenefits = currentTierData?.features.filter(f => !tier.features.includes(f)) || [];

    // Downgrade logic
    return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isLoading} className="cursor-pointer gap-2">
                 {isLoading ? <Loader2 className="animate-spin" /> : tier.icon}
                <div className="flex justify-between w-full">
                    <span>{actionText} to {tier.name}</span>
                    <span className="text-muted-foreground text-xs">{priceText}</span>
                </div>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Downgrade to {tier.name}</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to downgrade your plan. You will lose access to the following benefits:
              </AlertDialogDescription>
                <div className="text-sm text-muted-foreground">
                    <ul className="list-disc pl-5 mt-2 text-destructive">
                        {lostBenefits.map(b => <li key={b}>{b}</li>)}
                    </ul>
                </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDowngradeConfirm(tier.name as any)}>Confirm Downgrade</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
}

interface MembershipDropdownProps {
  fromHeader?: boolean;
}

export function MembershipDropdown({ fromHeader = false }: MembershipDropdownProps) {
    const [isAnnual, setIsAnnual] = React.useState(false);
    const router = useRouter();
    const { userTier, handleTierChange } = useUser();
    const { toast } = useToast();
    
    const currentTierData = allTiers.find(t => t.name === userTier) || allTiers.find(t=>t.name === 'Free')!;
    const currentTierLevel = currentTierData.level;

    const handlePlanChange = async (newTier: (typeof allTiers)[0]['name']) => {
         try {
            await handleTierChange(newTier);
            toast({
                title: "Plan Changed!",
                description: `You are now on the ${newTier} plan.`,
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Could not change your plan. Please try again.",
                variant: "destructive",
            });
        }
    }


    const TriggerButton = fromHeader ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            {currentTierData.icon}
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Membership: {currentTierData.name}</p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <Button variant="outline" className="w-full justify-between">
            <span>Change Plan</span>
            <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {TriggerButton}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                    Current Plan: <Badge variant="destructive">{currentTierData.name}</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => router.push('/membership')} className="cursor-pointer">
                    Compare All Plans
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-center gap-2 px-2 py-1.5">
                    <Label htmlFor="billing-cycle-header" className="text-xs">Monthly</Label>
                    <Switch id="billing-cycle-header" checked={isAnnual} onCheckedChange={setIsAnnual} className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-3.5" />
                    <Label htmlFor="billing-cycle-header" className="text-xs">Annual (Save ~17%)</Label>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {allTiers.filter(t => t.name !== userTier).map(t => (
                        <TierMenuItem 
                            key={t.name} 
                            tier={t} 
                            isAnnual={isAnnual} 
                            currentTier={userTier} 
                            currentTierLevel={currentTierLevel}
                            onDowngradeConfirm={handlePlanChange}
                            onUpgradeConfirm={handlePlanChange}
                        />
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
