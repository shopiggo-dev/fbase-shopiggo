
// src/components/shopiggo/ProductDetails.tsx
'use client'

import type { Product } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Bot, ShoppingCart, Lock } from 'lucide-react';
import { ProductCard } from '@/components/shopiggo/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
    userTier: 'Free' | 'Basic' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    isLoaded: boolean;
}

export function ProductDetails({ product, relatedProducts, userTier, isLoaded }: ProductDetailsProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = () => {
        addToCart(product);
        toast({
            title: "Added to cart",
            description: `${product.title} has been added to your cart.`,
        });
    };
    
    const canUsePremiumFeatures = isLoaded && userTier !== 'Free';

    const AskPixiButton = () => {
        if (!isLoaded) {
            return <Button size="lg" variant="outline" className="flex-1" disabled><Bot className="mr-2 h-5 w-5" /> Ask Pixi AI</Button>;
        }
        if (canUsePremiumFeatures) {
            return (
                <Button size="lg" variant="outline" className="flex-1">
                    <Bot className="mr-2 h-5 w-5" /> Ask Pixi AI
                </Button>
            );
        }
         return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="flex-1">
                            <Button size="lg" variant="outline" disabled className="w-full">
                                <Lock className="mr-2 h-5 w-5" /> Ask Pixi AI
                            </Button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Upgrade to a paid plan to use the Pixi AI assistant.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <div className="container py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Product Image */}
                <div className="sticky top-24">
                    <Image
                        src={product.imageURL}
                        alt={product.title}
                        width={800}
                        height={800}
                        className="rounded-lg shadow-lg object-cover w-full aspect-square"
                        data-ai-hint={'product'}
                    />
                </div>

                {/* Product Details */}
                <div>
                    <Badge variant="secondary">{product.storeName}</Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold my-3 font-headline">{product.title}</h1>
                    
                    {product.rating && product.reviews ? (
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-accent-foreground">
                                <Star className="w-5 h-5 fill-accent text-accent" />
                                <span className="font-semibold">{product.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                        </div>
                    ) : null}

                    <p className="text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
                    
                    <p className="text-foreground/80 leading-relaxed mb-8">{product.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href={product.productURL} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="lg" className="w-full">
                                Buy on {product.storeName}
                            </Button>
                        </a>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="flex-1">
                                        <Button size="lg" disabled className="w-full">
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Cart
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>The unified cart is coming soon!</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                     <div className="mt-4">
                        <AskPixiButton />
                    </div>
                </div>
            </div>
            
            {/* Related Products */}
            <div className="mt-24">
                <h2 className="text-3xl font-bold mb-8 text-center font-headline">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} userTier={userTier} isLoaded={isLoaded} />
                    ))}
                </div>
            </div>
        </div>
    );
}
