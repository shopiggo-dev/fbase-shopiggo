// src/components/shopiggo/DealCard.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/shopiggo/CountdownTimer";
import Image from 'next/image';
import { ImageOff, Ticket, Globe, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { countries as allCountries } from '@/lib/data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const countryData = [...new Set(allCountries)].map(country => {
    if (country === 'Global') return { name: country, currencyCode: 'USD', languageCode: 'en' };
    if (['Canada', 'United States', 'Australia', 'United Kingdom', 'Ireland', 'New Zealand', 'Singapore', 'South Africa'].includes(country)) return { name: country, currencyCode: 'USD', languageCode: 'en'};
    if (['Germany', 'Austria', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Portugal', 'Greece', 'Finland', 'Luxembourg', 'Cyprus', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Slovenia', 'Slovakia'].includes(country)) return { name: country, currencyCode: 'EUR', languageCode: 'en' };
    if (country === 'Japan') return { name: country, currencyCode: 'JPY', languageCode: 'ja' };
    if (country === 'China') return { name: country, currencyCode: 'CNY', languageCode: 'zh' };
    return { name: country, currencyCode: 'USD', languageCode: 'en'};
}).sort((a, b) => {
    if (a.name === 'Global') return -1;
    if (b.name === 'Global') return 1;
    if (a.name === 'United States') return -1;
    if (b.name === 'United States') return 1;
    return a.name.localeCompare(b.name);
});


// A simple function to highlight coupon codes in a description
const highlightGoCoupon = (text: string) => {
    if (!text) return null;
    const couponRegex = /\b([A-Z0-9]{5,})\b/g; // Example: finds uppercase words/numbers of 5+ chars
    const parts = text.split(couponRegex);

    return (
        <span>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <strong key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded-sm">{part}</strong>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export const DealCard = ({ promotion, className }: { promotion: Promotion, className?: string }) => {
    const [displayCountry, setDisplayCountry] = useState<string | null>(null);

    const cleanLinkName = (name?: string) => {
        if (!name) return 'Promotion';
        return name
            .replace(/logo/gi, '')
            .replace(/banner/gi, '')
            .replace(/\d+x\d+/gi, '')
            .replace(/Homepage/gi, '')
            .trim();
    };

    const isTextLink = promotion.linkType === 'Text Link' || (promotion.creativeHeight && promotion.creativeHeight <= 1);
    
    const imageUrl = React.useMemo(() => {
        if (isTextLink || !promotion.linkCodeHtml) {
             const bgColor = 'f0eefc'; // a light purple
             const textColor = '5B21B6'; // a deep purple
             const advertiserName = encodeURIComponent(promotion.advertiserName || 'Special Offer');
             return `https://placehold.co/400x200/${bgColor}/${textColor}.png?text=${advertiserName}&font=poppins`;
        }
        if (promotion.linkCodeHtml) {
            const htmlMatch = promotion.linkCodeHtml.match(/<img src="([^"]+)"/);
            if (htmlMatch) {
                // Ensure the URL is valid
                try {
                    new URL(htmlMatch[1]);
                    return htmlMatch[1];
                } catch (e) {
                     return `https://placehold.co/400x200/f0eefc/5B21B6.png?text=Invalid&font=poppins`;
                }
            }
        }
        return `https://placehold.co/400x200/f0eefc/5B21B6.png?text=No+Image&font=poppins`;
    }, [promotion, isTextLink]);

    const title = cleanLinkName(promotion.linkName);
    const hasGoCoupon = promotion.promotionType === 'Coupon' || (promotion.description && /\b([A-Z0-9]{5,})\b/g.test(promotion.description));
    const countries = (promotion as any).cleanTargetedCountries || [];

    const handleCountrySelect = (countryName: string) => {
        setDisplayCountry(countryName);
    };


    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
            <a href={promotion.clickUrl} target="_blank" rel="noopener noreferrer" className="block">
                <CardHeader className="p-0 relative border-b bg-muted/30 flex items-center justify-center aspect-[16/9]">
                    <Badge variant="secondary" className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                        <span>{promotion.advertiserName || 'Advertiser'}</span>
                    </Badge>
                    {hasGoCoupon && (
                        <Badge variant="destructive" className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                        <Ticket className="w-3 h-3" />
                        <span>GoCoupon</span>
                        </Badge>
                    )}
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={225}
                        className="object-contain w-full h-full p-2"
                        data-ai-hint={'product deal'}
                        unoptimized={true}
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x225.png' }}
                    />
                </CardHeader>
            </a>
            <CardContent className="p-3 flex-grow flex flex-col h-[90px]">
                 <a href={promotion.clickUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className="text-sm leading-tight font-semibold h-10 line-clamp-2 hover:text-primary">{title}</h3>
                </a>
                {promotion.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{highlightGoCoupon(promotion.description)}</p>
                )}
            </CardContent>
            <CardFooter className="p-3 pt-0 mt-auto flex flex-col items-start gap-1 min-h-[52px]">
                 {countries.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="link" className="text-xs text-muted-foreground p-0 h-6 hover:no-underline w-full justify-start">
                                <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3"/>
                                    <span>
                                        {displayCountry ? displayCountry : `Valid in ${countries.length} countr${countries.length === 1 ? 'y' : 'ies'}`}
                                    </span>
                                    <ChevronsUpDown className="w-3 h-3" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                             <ScrollArea className="h-48">
                                <div className="p-1 text-sm">
                                    {countries.map((country: string) => (
                                         <DropdownMenuItem
                                            key={country}
                                            className="cursor-pointer"
                                            onSelect={() => handleCountrySelect(country)}
                                        >
                                            {country}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {promotion.promotionEndDate && (
                    <CountdownTimer expiryTimestamp={promotion.promotionEndDate} />
                )}
            </CardFooter>
        </Card>
    )
}
