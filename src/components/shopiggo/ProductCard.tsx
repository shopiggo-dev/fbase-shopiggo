
'use client'

import type { Product } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Bell, ShoppingCart, Lock, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { PriceAlertForm } from './PriceAlertForm';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface ProductCardProps {
    product: Product;
    userTier: 'Free' | 'Basic' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    isLoaded: boolean;
}

const tierLevels: { [key: string]: number } = {
    'Free': 0,
    'Basic': 1,
    'Silver': 2,
    'Gold': 3,
    'Platinum': 4,
    'Diamond': 5
};

// Dummy contacts for the share dialog
const userContacts = [
    { id: 'contact-1', name: 'Alice Smith' },
    { id: 'contact-2', name: 'Bob Johnson' },
    { id: 'contact-3', name: 'Charlie Brown' },
];

function ShareDialogContent({ product, onShare }: { product: Product; onShare: () => void }) {
    const { toast } = useToast();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger the messaging service.
        toast({
            title: "Deal Shared!",
            description: `Your recommendation for ${product.title} has been sent.`,
        });
        onShare();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="contact-select">Share with</Label>
                <Select>
                    <SelectTrigger id="contact-select">
                        <SelectValue placeholder="Select a contact..." />
                    </SelectTrigger>
                    <SelectContent>
                        {userContacts.map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                                {contact.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="share-message">Add a message (optional)</Label>
                <Textarea id="share-message" placeholder={`Check out this deal on ${product.title}!`} />
            </div>
            <Button type="submit" className="w-full">Send</Button>
        </form>
    );
}

export function ProductCard({ product, userTier, isLoaded }: ProductCardProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isAlertSet, setIsAlertSet] = useState(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const { addToCart } = useCart();
    const { toast } = useToast();
    
    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
    };

    const handleAlertSet = () => {
        setIsAlertDialogOpen(false);
        setIsFavorited(true);
        setIsAlertSet(true);
    };

    const handleShare = () => {
        setIsShareDialogOpen(false);
    };
    
    const handleAddToCart = () => {
        addToCart(product);
        toast({
            title: "Added to cart",
            description: `${product.title} has been added to your cart.`,
        });
    };

    const hasGoldAccess = isLoaded && tierLevels[userTier] >= tierLevels['Gold'];
    const canAddToCart = false; // Unified cart is disabled for now

    const productLink = `/product/${product.id}`;

    const ShareButton = () => (
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <Share2 className="w-5 h-5" />
                                <span className="sr-only">Share Deal</span>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Share Deal</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Deal</DialogTitle>
                    <DialogDescription>
                        Send this deal to one of your contacts.
                    </DialogDescription>
                </DialogHeader>
                <ShareDialogContent product={product} onShare={handleShare} />
            </DialogContent>
        </Dialog>
    );

    const PriceAlertButton = () => (
        <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild disabled={!hasGoldAccess}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed", isAlertSet && "text-primary")}>
                                <Bell className={cn("w-5 h-5", isAlertSet && "fill-current")} />
                                <span className="sr-only">Set Price Alert</span>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    {!hasGoldAccess && (
                         <TooltipContent>
                            <p>Available for Gold members and above.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Price Alert for {product.title}</DialogTitle>
                    <DialogDescription>
                        Configure your notification preferences for this product.
                    </DialogDescription>
                </DialogHeader>
                <PriceAlertForm 
                    product={product} 
                    userTier={userTier} 
                    onAlertSet={handleAlertSet}
                />
            </DialogContent>
        </Dialog>
    );

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
            <CardHeader className="p-0 relative border-b">
                <Link href={productLink} aria-label={product.title}>
                     <Badge variant="secondary" className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                        <span>{product.storeName}</span>
                    </Badge>
                    <Image
                        src={product.imageURL}
                        alt={product.title}
                        width={600}
                        height={600}
                        className="object-cover w-full h-56"
                        data-ai-hint={'product'}
                    />
                </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col">
                <div className="flex-grow">
                     <Link href={productLink}>
                        <h3 className="text-base leading-tight font-semibold h-12 line-clamp-2">{product.title}</h3>
                    </Link>
                    {product.rating && product.reviews ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1 text-accent-foreground">
                                <Star className="w-4 h-4 text-accent fill-accent" />
                                <span>{product.rating}</span>
                            </div>
                            <span>({product.reviews})</span>
                        </div>
                    ) : null}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-2">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold font-headline text-primary">
                        ${product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center">
                        <ShareButton />
                        <PriceAlertButton />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn("text-muted-foreground hover:text-destructive", isFavorited && "text-destructive")}
                                        onClick={toggleFavorite}
                                    >
                                        <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
                                        <span className="sr-only">{isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <a href={product.productURL} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full">
                            Buy on {product.storeName}
                        </Button>
                    </a>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                 <span tabIndex={0} className="flex-1">
                                    <Button size="sm" disabled className="w-full">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
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
            </CardFooter>
        </Card>
    );
}

export const ProductCardWithUser = ({ product }: { product: Product }) => {
    const { userTier, isLoaded } = useUser();
    return <ProductCard product={product} userTier={userTier} isLoaded={isLoaded} />;
}
