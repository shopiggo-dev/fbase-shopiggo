
// src/components/shopiggo/DealsCarousel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Promotion } from "@/lib/promo-data";
import { DealCard } from "./DealCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { getDealsByCategory } from "@/lib/deals";

export function DealsCarousel({
  title,
  categories,
}: {
  title: string;
  categories: string[];
}) {
  const [deals, setDeals] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const items = await getDealsByCategory(categories, 20);
        if (isMounted) {
            setDeals(items);
        }
      } catch (e: any) {
        console.error("Deal fetch failed:", e);
        if (isMounted) {
            if (e.message.includes('firestore/indexes')) {
                 setError("The required Firestore index is missing. Please check the Firebase console to create it.");
            } else {
                 setError(e?.message || "Failed to load deals.");
            }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [categories]);
  
  const plugin = React.useRef(
      Autoplay({ delay: 3000 + Math.random() * 2000, stopOnInteraction: true })
  );

  return (
    <div className="container">
      <h2 className="text-3xl font-bold text-center mb-10 font-headline">{title}</h2>
       {loading ? (
        <div className="flex space-x-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-1/6">
                    <Skeleton className="h-[280px] w-full" />
                </div>
            ))}
        </div>
       ) : error ? (
        <div className="text-red-600 p-4 bg-red-50 rounded-md"><strong>Error:</strong> {error}</div>
       ) : deals.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground bg-card rounded-lg">
            No deals available for this category right now.
        </div>
       ) : (
        <>
            <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {deals.map((promo, index) => (
                        <CarouselItem key={`${promo.linkId}-${index}`} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                            <div className="h-full">
                                <DealCard promotion={promo} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
            </Carousel>
             <div className="text-center mt-12">
                <Link href="/hot-deals">
                    <Button size="lg" variant="outline">
                        <span>View All Deals</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </>
       )}
    </div>
  );
}
