
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';

const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["6", "7", "8", "9", "10", "11", "12", "13"];

export interface MoreFiltersSheetProps {
  children?: React.ReactNode;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  ratingRange: [number, number];
  onRatingChange: (value: [number, number]) => void;
  reviewRange: [number, number];
  onReviewChange: (value: [number, number]) => void;
}

export function MoreFiltersSheet({
  children,
  priceRange,
  onPriceChange,
  ratingRange,
  onRatingChange,
  reviewRange,
  onReviewChange,
}: MoreFiltersSheetProps) {
  const [open, setOpen] = React.useState(false);

  const resetFilters = () => {
    onPriceChange([0, 1200]);
    onRatingChange([0, 5]);
    onReviewChange([0, 150000]);
    // Note: Resetting new filters would be added here
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>More Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
           <div className="py-4 space-y-8">
               <Accordion type="multiple" defaultValue={['price', 'rating', 'gender', 'age', 'size', 'delivery']}>
                 <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                        <Slider
                          value={priceRange}
                          max={1200}
                          step={10}
                          onValueChange={(value) => onPriceChange(value as [number, number])}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          ${priceRange[0]} - ${priceRange[1]}
                        </p>
                    </AccordionContent>
                 </AccordionItem>
                  <AccordionItem value="rating">
                    <AccordionTrigger>Customer Rating</AccordionTrigger>
                    <AccordionContent>
                        <Slider
                          value={ratingRange}
                          max={5}
                          step={0.1}
                          onValueChange={(value) => onRatingChange(value as [number, number])}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)} stars
                        </p>
                    </AccordionContent>
                 </AccordionItem>
                 <AccordionItem value="reviews">
                    <AccordionTrigger>Number of Reviews</AccordionTrigger>
                    <AccordionContent>
                        <Slider
                          value={reviewRange}
                          max={150000}
                          step={100}
                          onValueChange={(value) => onReviewChange(value as [number, number])}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          {reviewRange[0]} - {reviewRange[1]} reviews
                        </p>
                    </AccordionContent>
                 </AccordionItem>
                  <AccordionItem value="gender">
                    <AccordionTrigger>Gender</AccordionTrigger>
                    <AccordionContent>
                       <RadioGroup>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="g-all" /><Label htmlFor="g-all">All</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="men" id="g-men" /><Label htmlFor="g-men">Men</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="women" id="g-women" /><Label htmlFor="g-women">Women</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="unisex" id="g-unisex" /><Label htmlFor="g-unisex">Unisex</Label></div>
                       </RadioGroup>
                    </AccordionContent>
                 </AccordionItem>
                 <AccordionItem value="age">
                    <AccordionTrigger>Age Group</AccordionTrigger>
                    <AccordionContent>
                       <RadioGroup>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="a-all" /><Label htmlFor="a-all">All</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="adult" id="a-adult" /><Label htmlFor="a-adult">Adult</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="kids" id="a-kids" /><Label htmlFor="a-kids">Kids</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="toddler" id="a-toddler" /><Label htmlFor="a-toddler">Toddler</Label></div>
                           <div className="flex items-center space-x-2"><RadioGroupItem value="baby" id="a-baby" /><Label htmlFor="a-baby">Baby</Label></div>
                       </RadioGroup>
                    </AccordionContent>
                 </AccordionItem>
                  <AccordionItem value="size">
                    <AccordionTrigger>Size</AccordionTrigger>
                    <AccordionContent>
                      <Tabs defaultValue="apparel">
                          <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="apparel">Apparel</TabsTrigger>
                              <TabsTrigger value="shoes">Shoes</TabsTrigger>
                          </TabsList>
                          <TabsContent value="apparel" className="pt-4">
                              <div className="grid grid-cols-3 gap-2">
                                  {apparelSizes.map(size => (
                                      <div key={size} className="flex items-center space-x-2">
                                          <Checkbox id={`size-a-${size}`} />
                                          <Label htmlFor={`size-a-${size}`}>{size}</Label>
                                      </div>
                                  ))}
                              </div>
                          </TabsContent>
                          <TabsContent value="shoes" className="pt-4">
                               <div className="grid grid-cols-4 gap-2">
                                  {shoeSizes.map(size => (
                                      <div key={size} className="flex items-center space-x-2">
                                          <Checkbox id={`size-s-${size}`} />
                                          <Label htmlFor={`size-s-${size}`}>{size}</Label>
                                      </div>
                                  ))}
                              </div>
                          </TabsContent>
                      </Tabs>
                    </AccordionContent>
                 </AccordionItem>
                  <AccordionItem value="delivery">
                    <AccordionTrigger>Delivery</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="free-shipping" />
                                <Label htmlFor="free-shipping">Free Shipping</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="store-pickup" />
                                <Label htmlFor="store-pickup">Store Pickup</Label>
                            </div>
                        </div>
                    </AccordionContent>
                 </AccordionItem>
               </Accordion>
           </div>
        </ScrollArea>
        <SheetFooter className="mt-auto pt-4 border-t">
          <div className='w-full flex justify-between'>
            <Button variant="ghost" onClick={resetFilters}>Reset</Button>
            <Button onClick={() => setOpen(false)}>Apply Filters</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
