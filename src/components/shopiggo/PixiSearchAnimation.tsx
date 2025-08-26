
// src/components/shopiggo/PixiSearchAnimation.tsx
'use client'

import { retailers } from '@/lib/data';
import { Sparkles, Search } from 'lucide-react';

const shuffledRetailers = [...retailers].sort(() => 0.5 - Math.random());
const firstHalf = shuffledRetailers.slice(0, Math.ceil(shuffledRetailers.length / 2));
const secondHalf = shuffledRetailers.slice(Math.ceil(shuffledRetailers.length / 2));

export function PixiSearchAnimation({ searchTerm }: { searchTerm: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-card rounded-lg overflow-hidden">
            <div className="relative flex items-center justify-center w-48 h-48">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse"></div>
                {/* Inner Ring */}
                <div className="absolute inset-2 border-2 border-primary/30 rounded-full animate-pulse delay-150"></div>
                
                {/* Central Icon */}
                <div className="relative bg-primary/10 text-primary p-6 rounded-full">
                    <Sparkles className="w-16 h-16" />
                </div>
            </div>
            
            <h2 className="mt-8 text-2xl font-bold font-headline">Pixi is searching for "{searchTerm}"...</h2>
            <p className="text-muted-foreground mt-2">Scanning hundreds of stores to find you the best deals!</p>

            <div className="w-full max-w-4xl mt-12 space-y-4">
                 <div className="relative h-10 flex gap-8 overflow-hidden">
                    <div className="marquee-left flex-shrink-0 flex items-center gap-8">
                        {[...firstHalf, ...firstHalf].map((name, index) => (
                            <span key={`retailer-a-${index}`} className="text-lg font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                        ))}
                    </div>
                    <div className="marquee-left flex-shrink-0 flex items-center gap-8">
                         {[...firstHalf, ...firstHalf].map((name, index) => (
                            <span key={`retailer-a-dup-${index}`} className="text-lg font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                        ))}
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-card"></div>
                </div>
                 <div className="relative h-10 flex gap-8 overflow-hidden">
                    <div className="marquee-right flex-shrink-0 flex items-center gap-8">
                         {[...secondHalf, ...secondHalf].map((name, index) => (
                            <span key={`retailer-b-${index}`} className="text-lg font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                        ))}
                    </div>
                     <div className="marquee-right flex-shrink-0 flex items-center gap-8">
                         {[...secondHalf, ...secondHalf].map((name, index) => (
                            <span key={`retailer-b-dup-${index}`} className="text-lg font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                        ))}
                    </div>
                     <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-card"></div>
                </div>
            </div>
        </div>
    );
}
