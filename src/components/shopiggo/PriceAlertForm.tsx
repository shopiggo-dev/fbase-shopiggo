
'use client'

import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import type { Product } from '@/lib/data';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

interface PriceAlertFormProps {
    product: Product;
    userTier: string;
    onAlertSet: () => void;
}

const tierLevels: { [key: string]: number } = {
    'Free': 0, 'Basic': 1, 'Silver': 2, 'Gold': 3, 'Platinum': 4, 'Diamond': 5
};

export function PriceAlertForm({ product, userTier, onAlertSet }: PriceAlertFormProps) {
    const [timeframe, setTimeframe] = useState('7d');
    const [customTimeframe, setCustomTimeframe] = useState('');
    const { toast } = useToast();
    
    const hasPlatinumAccess = tierLevels[userTier] >= tierLevels['Platinum'];
    const hasDiamondAccess = tierLevels[userTier] >= tierLevels['Diamond'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would submit the form data to a backend service.
        toast({
            title: "Price Alert Set!",
            description: `We'll notify you about price changes for ${product.title}.`,
        });
        onAlertSet();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* Timeframe Selection */}
            <div className="space-y-2">
                <Label htmlFor="timeframe">Alert Timeframe</Label>
                <div className="flex gap-2">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger id="timeframe" className="flex-grow">
                            <SelectValue placeholder="Select timeframe..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Next 7 Days</SelectItem>
                            <SelectItem value="14d">Next 14 Days</SelectItem>
                            <SelectItem value="30d">Next 30 Days</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                    {timeframe === 'custom' && (
                        <Input
                            type="date"
                            value={customTimeframe}
                            onChange={(e) => setCustomTimeframe(e.target.value)}
                            className="w-48"
                        />
                    )}
                </div>
            </div>

            {/* Notification Methods */}
            <div className="space-y-2">
                <Label>Notify Me Via</Label>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="notify-app" />
                        <Label htmlFor="notify-app" className="font-normal">Push Notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="notify-sms" />
                        <Label htmlFor="notify-sms" className="font-normal">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="notify-email" defaultChecked />
                        <Label htmlFor="notify-email" className="font-normal">Email</Label>
                    </div>
                </div>
            </div>

            {/* Automated Actions (Tier-gated) */}
            <div className="space-y-3">
                 <Label>Action at Lowest Price</Label>
                 <RadioGroup defaultValue="notify">
                    <div className="flex items-center space-x-2">
                         <RadioGroupItem value="notify" id="action-notify" />
                         <Label htmlFor="action-notify" className="font-normal">Notify me only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                         <RadioGroupItem value="add-to-cart" id="action-add" disabled={!hasPlatinumAccess} />
                         <Label htmlFor="action-add" className="font-normal flex items-center gap-2">
                            Add to Cart
                            {!hasPlatinumAccess && <Badge variant="outline">Platinum+</Badge>}
                         </Label>
                    </div>
                     <div className="flex items-center space-x-2">
                         <RadioGroupItem value="auto-purchase" id="action-purchase" disabled={!hasDiamondAccess} />
                         <Label htmlFor="action-purchase" className="font-normal flex items-center gap-2">
                            Auto-Purchase
                            {!hasDiamondAccess && <Badge variant="outline">Diamond</Badge>}
                         </Label>
                    </div>
                 </RadioGroup>
            </div>
            
            {/* AI Optimization (Tier-gated) */}
            <div className="flex items-center space-x-2 rounded-lg border p-4 bg-secondary/50">
                 <Checkbox id="pixi-optimize" disabled={!hasDiamondAccess} />
                 <Label htmlFor="pixi-optimize" className="font-normal flex flex-col gap-1">
                     <span className="flex items-center gap-2">
                        <Bot className="text-primary"/> Let Pixi AI find the best time
                        {!hasDiamondAccess && <Badge variant="outline">Diamond</Badge>}
                    </span>
                    <span className="text-xs text-muted-foreground">Pixi will analyze historical price data for this product and retailer.</span>
                 </Label>
            </div>

            <Button type="submit" className="w-full">Set Alert</Button>
        </form>
    );
}
