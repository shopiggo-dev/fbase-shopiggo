
'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Coins, CreditCard, Package2, ShieldCheck, Bell, UserPlus, LogIn, LayoutDashboard, Ticket, TrendingDown, Target, ShoppingCart, Gem, Crown, Star, User, Search, Settings, Cube, View, Store, Check, Sparkles, Tags, Rocket, ImageOff, X } from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { retailers, retailersCarousel, countriesCarousel, categoriesCarousel } from "@/lib/data";
import { CountdownTimer } from "@/components/shopiggo/CountdownTimer";
import { type Promotion } from '@/lib/promo-data';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { DealCard } from "@/components/shopiggo/DealCard";
import { DealsCarousel } from "@/components/shopiggo/DealsCarousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const PromotionCard = ({ promotion }: { promotion: Promotion }) => {

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
        if (isTextLink) {
             const bgColor = 'F5F5DC'; // Light beige from theme
             const textColor = '333333';
             const advertiserName = encodeURIComponent(promotion.advertiserName || 'Special Offer');
             return `https://placehold.co/250x144/${bgColor}/${textColor}.png?text=${advertiserName}&font=poppins`;
        }
        if (promotion.linkCodeHtml) {
            const htmlMatch = promotion.linkCodeHtml.match(/<img src="([^"]+)"/);
            if (htmlMatch) {
                return htmlMatch[1];
            }
        }
        return null;
    }, [promotion, isTextLink]);

    const title = cleanLinkName(promotion.linkName);

    return (
        <a href={promotion.clickUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
            <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
                 <CardHeader className="p-0 relative border-b bg-muted/30 flex items-center justify-center h-36">
                     <Badge variant="secondary" className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                        <span>{promotion.advertiserName || 'Advertiser'}</span>
                    </Badge>
                     {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={250}
                            height={144}
                            className="object-contain w-full h-full p-2"
                            data-ai-hint={'product deal'}
                            unoptimized={true}
                        />
                     ) : <div className="h-full w-full flex items-center justify-center bg-secondary"><ImageOff className="w-10 h-10 text-muted-foreground"/></div>}
                </CardHeader>
                <CardContent className="p-3 flex-grow flex flex-col">
                    <h3 className="text-sm leading-tight font-semibold h-10 line-clamp-2">{title}</h3>
                    {promotion.description && (
                         <p className="text-[10px] text-muted-foreground mt-1 line-clamp-3">{promotion.description}</p>
                    )}
                </CardContent>
                 {promotion.promotionEndDate && (
                    <CardFooter className="p-3 pt-0 mt-auto">
                        <CountdownTimer expiryTimestamp={promotion.promotionEndDate} />
                    </CardFooter>
                 )}
            </Card>
        </a>
    )
}

const FeatureCard = ({ icon, title, description, isSearch, demoContent }: { icon: React.ReactNode, title: string, description: string, isSearch?: boolean, demoContent?: React.ReactNode }) => {
    const [isRevealed, setIsRevealed] = React.useState(false);

    return (
        <motion.div
            onHoverStart={() => setIsRevealed(true)}
            onHoverEnd={() => setIsRevealed(false)}
            onClick={() => setIsRevealed(!isRevealed)}
            className="bg-card rounded-lg shadow-sm text-center flex flex-col items-center cursor-pointer overflow-hidden"
            style={{ height: isRevealed && demoContent ? '22rem' : '14rem', transition: 'height 0.4s ease-in-out' }}
        >
            <AnimatePresence>
                {isRevealed && demoContent ? (
                    <motion.div
                        key="demo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full p-4 flex flex-col"
                    >
                        <h3 className="text-lg font-semibold mb-2 font-headline">{title}</h3>
                        <div className="flex-grow w-full relative">
                           {demoContent}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 flex flex-col items-center justify-center h-full"
                    >
                        <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
                            {icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 font-headline">{title}</h3>
                        <p className="text-muted-foreground text-sm flex-grow">{description}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const MultiStoreSearchDemo = () => (
     <div className="relative h-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent z-10"></div>
        <div className="marquee-vertical">
            {[...retailers, ...retailers].map((store, index) => (
                <div key={index} className="flex items-center space-x-2 p-2">
                    <Checkbox id={`store-demo-${index}`} checked={index % 5 === 0} readOnly/>
                    <Label htmlFor={`store-demo-${index}`} className="font-normal">{store}</Label>
                </div>
            ))}
        </div>
    </div>
);

const PixiAiDemo = () => {
    const variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };
    return (
         <div className="relative h-full overflow-hidden flex flex-col justify-end p-2 space-y-2">
             <motion.div
                className="bg-muted p-3 rounded-lg self-end max-w-xs"
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.3 }}
            >
                <p className="text-sm text-right">What's the best TV under $500?</p>
            </motion.div>
             <motion.div
                className="bg-primary/10 p-3 rounded-lg self-start max-w-xs flex gap-2"
                 initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.3, delay: 0.5 }}
            >
                 <Bot className="text-primary w-5 h-5 mt-1 shrink-0" />
                 <p className="text-sm text-left">The TCL 5-Series is a great option. It's available at Best Buy and Amazon. Prices tend to drop mid-week, so I'd recommend buying on a Wednesday!</p>
            </motion.div>
        </div>
    );
}

const UnifiedCartDemo = () => {
    const demoItems = [
        { title: 'Classic Sneakers', store: 'Nike', image: 'https://placehold.co/40x40.png?text=👟' },
        { title: 'Smart Speaker', store: 'Amazon', image: 'https://placehold.co/40x40.png?text=🔊' },
        { title: 'Organic Milk', store: 'Target', image: 'https://placehold.co/40x40.png?text=🥛' },
    ];
    const variants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.2,
            },
        }),
    };
    return (
        <div className="relative h-full flex flex-col justify-center space-y-2 p-2 border rounded-md">
            {demoItems.map((item, i) => (
                <motion.div
                    key={item.title}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-md"
                >
                    <Image src={item.image} alt={item.title} width={40} height={40} className="rounded" />
                    <div className="text-left text-sm">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-muted-foreground">from <span className="font-medium text-foreground">{item.store}</span></p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const PriceAlertDemo = () => {
    const [isAlertSet, setIsAlertSet] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsAlertSet(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative h-full flex flex-col items-center justify-center p-2 border rounded-md overflow-hidden">
            <AnimatePresence>
                {!isAlertSet ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full space-y-4"
                    >
                        <div className="text-center">
                            <p className="font-medium">Nike Air Zoom</p>
                            <p className="text-xl font-bold text-muted-foreground">$120.00</p>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="price-target" className="text-xs">Set Target Price & Auto-Purchase</Label>
                             <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm">$</span>
                                <Input id="price-target" defaultValue="95.00" className="pl-6" />
                             </div>
                        </div>
                         <Button size="sm" className="w-full">
                            <Bell className="mr-2" /> Set Alert
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="confirmation"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center p-4 bg-green-100/10 rounded-lg"
                    >
                        <ShoppingCart className="w-8 h-8 mx-auto text-green-500" />
                        <h4 className="font-bold text-green-400 mt-2">Price Target Hit!</h4>
                        <p className="text-sm text-green-500">Auto-purchased at $94.99.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const GoCoinsDemo = () => {
    const transactions = [
        { store: 'Nike', earned: 1.10 },
        { store: 'Amazon', earned: 0.50 },
        { store: 'Target', earned: 0.40 },
    ];
    const [balance, setBalance] = React.useState(125.50);

    return (
        <div className="relative h-full flex flex-col justify-center space-y-2 p-2 border rounded-md">
            <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">GoCoins Balance</p>
                <p className="text-2xl font-bold text-amber-500">{balance.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
                 {transactions.map((t, i) => (
                    <motion.div
                        key={t.store}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.3 }}
                        className="flex justify-between items-center bg-muted/50 p-2 rounded-md text-sm"
                    >
                        <p>Purchase from {t.store}</p>
                        <motion.p
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 1 + i * 0.3 }}
                             className="font-semibold text-amber-600"
                        >
                            +{t.earned.toFixed(2)}
                        </motion.p>
                    </motion.div>
                 ))}
            </div>
        </div>
    );
};

const ConsolidatedCouponsDemo = () => {
    const coupons = [
        { retailer: 'Nike', discount: '20% Off', code: 'SAVE20' },
        { retailer: 'Target', discount: '$10 Off $50', code: 'GET10' },
        { retailer: 'Sephora', discount: 'Free Gift', code: 'GIFTME' },
    ];
    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.2,
            },
        }),
    };
    return (
        <div className="relative h-full flex flex-col justify-center space-y-2 p-2 border rounded-md">
            {coupons.map((coupon, i) => (
                <motion.div
                    key={coupon.retailer}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    className="flex items-center justify-between gap-3 p-2 bg-muted/50 rounded-md"
                >
                    <div className="text-left text-sm">
                        <p className="font-semibold">{coupon.retailer}</p>
                        <p className="text-primary font-bold">{coupon.discount}</p>
                    </div>
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Clip</div>
                </motion.div>
            ))}
        </div>
    );
};

const TieredMembershipsDemo = () => {
    const tiers = [
        { name: 'Free', icon: <User className="w-5 h-5" /> },
        { name: 'Basic', icon: <Star className="w-5 h-5" /> },
        { name: 'Gold', icon: <Crown className="w-5 h-5" /> },
        { name: 'Diamond', icon: <Gem className="w-5 h-5" /> },
    ];
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: { delay: i * 0.15, duration: 0.4 },
        }),
    };
    return (
        <div className="relative h-full grid grid-cols-2 grid-rows-2 gap-2 p-2 border rounded-md">
            {tiers.map((tier, i) => (
                <motion.div
                    key={tier.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg"
                >
                    <div className="p-2 bg-primary/10 rounded-full mb-1 text-primary">
                        {tier.icon}
                    </div>
                    <p className="font-bold text-xs">{tier.name}</p>
                </motion.div>
            ))}
        </div>
    );
};

const PersonalizedShoppingDemo = () => {
    const preferences = [
        { name: 'Nike', checked: true },
        { name: 'Electronics', checked: true },
        { name: 'Adidas', checked: false },
        { name: 'Home Goods', checked: true },
    ];
     const variants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.15,
            },
        }),
    };
    return (
         <div className="relative h-full flex flex-col justify-center space-y-2 p-2 border rounded-md">
            {preferences.map((pref, i) => (
                <motion.div
                    key={pref.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    className="flex items-center space-x-2"
                >
                    <Checkbox id={`pref-demo-${i}`} checked={pref.checked} readOnly/>
                    <Label htmlFor={`pref-demo-${i}`} className="font-normal text-sm">{pref.name}</Label>
                </motion.div>
            ))}
        </div>
    )
};


const XrProductViewerDemo = () => (
    <div className="relative h-full flex flex-col items-center justify-center p-2 border rounded-md bg-secondary/30">
        <Image 
            src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhcm1jaGFpclxlbnwwfHx8fDE3NTMyMDc0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Product for AR view"
            width={100}
            height={100}
            className="rounded-lg shadow-lg object-cover"
            data-ai-hint="armchair"
        />
        <Button size="sm" className="mt-4">
            <View className="mr-2"/> View in your space
        </Button>
    </div>
);

const MultiverseShoppingDemo = () => {
    const [isVREnabled, setVREnabled] = React.useState(false);
    React.useEffect(() => {
        const timer = setTimeout(() => setVREnabled(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative h-full flex flex-col items-center justify-center p-2 border rounded-md overflow-hidden bg-blue-950 text-white">
            <AnimatePresence>
                {!isVREnabled ? (
                     <motion.div
                        key="headset"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.5 } }}
                        className="text-center"
                    >
                        <Image 
                            src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx2ciUyMGhlYWRzZXR8ZW58MHx8fHwxNzUzMjA5MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                            width={80}
                            height={80}
                            alt="VR Headset"
                            className="mx-auto"
                            data-ai-hint="vr headset"
                        />
                        <p className="mt-2 text-sm font-medium">Entering the Multiverse...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="store"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.8 } }}
                        className="w-full h-full flex flex-col items-center justify-center space-y-2 text-center"
                    >
                         <Store className="w-10 h-10 text-blue-300" />
                         <p className="font-bold">Welcome to the Virtual Store</p>
                         <div className="flex gap-2">
                             <Badge variant="outline" className="border-blue-400 text-blue-300">Nike</Badge>
                             <Badge variant="outline" className="border-blue-400 text-blue-300">Zara</Badge>
                              <Badge variant="outline" className="border-blue-400 text-blue-300">Sony</Badge>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const membershipTiers = [
    { name: "Free", monthlyPrice: 0, annualPrice: 0, savings: 0, features: ["Basic multi-store search", "Limited view of Hot Deals", "Standard support"], isPopular: false },
    { name: "Basic", monthlyPrice: 9.99, annualPrice: 99.90, savings: 50, features: ["Everything in Free, plus:", "Pixi AI Assistant (25 queries/day)", "Unified Cart", "GoCoins Rewards (1x)", "Priority support"], isPopular: false },
    { name: "Silver", monthlyPrice: 39.99, annualPrice: 399.90, savings: 150, features: ["Everything in Basic, plus:", "Pixi AI Assistant (100 queries/day)", "GoCoins Rewards (1.5x)", "Set price drop alerts & get notified"], isPopular: false },
    { name: "Gold", monthlyPrice: 49.99, annualPrice: 499.90, savings: 250, features: ["Everything in Silver, plus:", "Unlimited Pixi AI Assistant", "GoCoins Rewards (2x)", "Advanced price change notifications", "Early access to deals"], isPopular: true },
    { name: "Platinum", monthlyPrice: 59.99, annualPrice: 599.90, savings: 500, features: ["Everything in Gold, plus:", "GoCoins Rewards (2.5x)", "Auto-add to cart at lowest price", "Exclusive partner offers", "Dedicated account manager"], isPopular: false },
    { name: "Diamond", monthlyPrice: 79.99, annualPrice: 799.90, savings: 1000, features: ["Everything in Platinum, plus:", "GoCoins Rewards (3x)", "Auto-purchase at lowest price", "XR Product Viewer (AR/VR)", "Personalized shopping reports", "VIP event invitations"], isPopular: false },
];

const InfoBox = ({ icon, title, description, href, buttonText, buttonVariant = "default" }: { icon: React.ReactNode, title: string, description: string, href: string, buttonText: string, buttonVariant?: "default" | "outline" }) => (
    <Card className="text-center flex flex-col items-center p-6">
        <div className="text-primary mb-3">{icon}</div>
        <CardTitle className="text-xl font-semibold mb-2">{title}</CardTitle>
        <CardDescription className="mb-4 flex-grow">{description}</CardDescription>
        <Link href={href}>
            <Button variant={buttonVariant}>{buttonText}</Button>
        </Link>
    </Card>
);

function GuestCtaBanner() {
    const [isVisible, setIsVisible] = React.useState(true);
    const { user, isLoaded } = useUser();

     React.useEffect(() => {
        const hasDismissed = localStorage.getItem('hasDismissedHomeBanner');
        if (hasDismissed === 'true') {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('hasDismissedHomeBanner', 'true');
        setIsVisible(false);
    };

    if (!isLoaded || user || !isVisible) {
        return null;
    }

    return (
        <Alert className="mb-8 relative bg-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold">Get the Full Experience!</AlertTitle>
            <AlertDescription>
                 <Link href="/signup"><span className="font-bold underline">Create a free account</span></Link> to see up to 5x more deals, search for promotions, and unlock other amazing features.
            </AlertDescription>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleDismiss}
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
            </Button>
        </Alert>
    );
}

export default function Home() {
    const { user, isLoaded } = useUser();
    const [isAnnual, setIsAnnual] = React.useState(false);

    const renderHeroContent = () => {
        if (!isLoaded) {
            return (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Skeleton className="h-12 w-40 rounded-md" />
                    <Skeleton className="h-12 w-40 rounded-md" />
                </div>
            )
        }

        if (user) {
            return (
                 <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link href="/search">
                        <Button size="lg" className="h-12 w-full sm:w-auto">
                            <Search className="mr-2"/>
                            Start Shopping
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto">
                            <LayoutDashboard className="mr-2"/>
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>
            )
        }

        return (
             <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <InfoBox 
                    icon={<UserPlus className="h-8 w-8" />}
                    title="New to Shopiggo?"
                    description="Create a free account to get started with basic search features."
                    href="/signup"
                    buttonText="Create a Free Account"
                />
                 <InfoBox 
                    icon={<LogIn className="h-8 w-8" />}
                    title="Already a member?"
                    description="Sign in to access your dashboard, cart, and exclusive deals."
                    href="/login"
                    buttonText="Sign In"
                    buttonVariant="outline"
                />
                 <InfoBox 
                    icon={<Gem className="h-8 w-8" />}
                    title="Unlock More"
                    description="Explore our membership plans to unlock premium features."
                    href="/membership"
                    buttonText="View Memberships"
                    buttonVariant="outline"
                />
                 <InfoBox 
                    icon={<Rocket className="h-8 w-8" />}
                    title="How It Works"
                    description="Discover how our features can revolutionize your shopping."
                    href="#features"
                    buttonText="Explore Features"
                    buttonVariant="outline"
                />
            </div>
        )
    }
    
    return (
        <div className="flex flex-col">
            
            {/* Hero Section */}
            <section className="text-center pt-32 pb-12 lg:pt-36 lg:pb-16 bg-secondary/30">
                <div className="container">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">
                        Your AI-Powered Gateway to Smarter Shopping.
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Unlock exclusive deals, compare prices across stores, and get expert advice from Pixi, your personal AI shopping assistant.
                    </p>
                    {renderHeroContent()}
                </div>
            </section>

             {/* Deals Carousels Section */}
            <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 bg-background space-y-16">
                 <div className="container -mb-8">
                    <GuestCtaBanner />
                </div>
                <DealsCarousel 
                    title="Top Fashion & Apparel Deals"
                    categories={['Apparel', 'Fashion', 'Clothing & Accessories', 'Shoes']}
                />
                <DealsCarousel 
                    title="Latest in Women's Fashion"
                    categories={['Womens', 'women', 'Apparel', 'Fashion']}
                />
                <DealsCarousel 
                    title="Latest in Home & Garden"
                    categories={['Home', 'Garden', 'Furniture', 'Home Goods', 'Kitchen', 'Bed & Bath']}
                />
                 <DealsCarousel 
                    title="Health & Beauty Offers"
                    categories={['Health & Beauty', 'Beauty', 'Cosmetics', 'Bath & Body', 'Fragrance', 'Nutritional Supplements', 'Wellness']}
                />
                <DealsCarousel
                    title="Bath & Body Essentials"
                    categories={['Bath & Body', 'Beauty', 'Cosmetics', 'Fragrance']}
                />
                <DealsCarousel 
                    title="Hot Deals in Electronics"
                    categories={['Electronics', 'Computers & Electronics', 'Consumer Electronics', 'Computer Hardware']}
                />
                <DealsCarousel 
                    title="Top Appliance Deals"
                    categories={['Appliances', 'Home Appliances', 'Kitchen Appliances']}
                />
                <DealsCarousel 
                    title="Top Furniture Finds"
                    categories={['Furniture', 'Office', 'Home', 'Decor']}
                />
                <DealsCarousel 
                    title="Sports & Fitness Savings"
                    categories={['Sporting Goods', 'Sports & Fitness', 'Apparel', 'Recreation & Leisure', 'Outdoors', 'Golf']}
                />
                 <DealsCarousel 
                    title="Jewelry & Accessories"
                    categories={['Jewelry', 'Accessories']}
                />
                <DealsCarousel
                    title="Pets & Pet Care"
                    categories={['Pets', 'Pet Supplies']}
                />
                 <DealsCarousel 
                    title="Nutrition & Health"
                    categories={['Health & Wellness', 'Nutritional Supplements', 'Health & Beauty', 'Health Food']}
                />
                 <DealsCarousel 
                    title="Travel & Experiences"
                    categories={['Air', 'Hotel', 'Travel', 'Vacation', 'Event', 'Recreation & Leisure']}
                />
            </section>
            
            {/* Supported Stores Section */}
            <section className="py-12 bg-background">
                <div className="container">
                    <h2 className="text-center text-muted-foreground font-semibold tracking-wider uppercase">
                        Search Across 300+ Supported Retailers
                    </h2>
                     <div className="relative mt-8 h-20 flex gap-8 overflow-hidden">
                        <div className="marquee-retailers flex-shrink-0 flex items-center gap-8">
                            {[...retailersCarousel, ...retailersCarousel].map((name, index) => (
                                <span key={`retailer-${index}`} className="text-xl font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                            ))}
                        </div>
                        <div className="marquee-retailers flex-shrink-0 flex items-center gap-8">
                            {[...retailersCarousel, ...retailersCarousel].map((name, index) => (
                                <span key={`retailer-dup-${index}`} className="text-xl font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                            ))}
                        </div>
                         <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
                    </div>
                </div>
            </section>

             {/* Global Presence Section */}
             <section className="py-12 bg-secondary/5">
                <div className="container">
                    <h2 className="text-center text-muted-foreground font-semibold tracking-wider uppercase">
                        Supported in 100+ Global Markets
                    </h2>
                     <div className="relative mt-8 h-20 flex gap-8 overflow-hidden">
                        <div className="marquee-markets flex-shrink-0 flex items-center gap-8">
                            {[...countriesCarousel, ...countriesCarousel].map((country, index) => (
                                <span key={`country-${index}`} className="text-xl font-bold text-muted-foreground/80 text-center flex-shrink-0">{country}</span>
                            ))}
                        </div>
                        <div className="marquee-markets flex-shrink-0 flex items-center gap-8">
                            {[...countriesCarousel, ...countriesCarousel].map((country, index) => (
                                <span key={`country-dup-${index}`} className="text-xl font-bold text-muted-foreground/80 text-center flex-shrink-0">{country}</span>
                            ))}
                        </div>
                         <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5"></div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-12 bg-background">
                <div className="container">
                    <h2 className="text-center text-muted-foreground font-semibold tracking-wider uppercase">
                        Shop Across 50+ Categories
                    </h2>
                     <div className="relative mt-8 h-20 flex gap-8 overflow-hidden">
                        <div className="marquee-categories flex-shrink-0 flex items-center gap-8">
                            {[...categoriesCarousel, ...categoriesCarousel].map((name, index) => (
                                <span key={`category-${index}`} className="text-xl font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                            ))}
                        </div>
                        <div className="marquee-categories flex-shrink-0 flex items-center gap-8">
                            {[...categoriesCarousel, ...categoriesCarousel].map((name, index) => (
                                <span key={`category-dup-${index}`} className="text-xl font-bold text-muted-foreground/80 text-center flex-shrink-0">{name}</span>
                            ))}
                        </div>
                         <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
                    </div>
                </div>
            </section>

             {/* Explainer Video Section */}
            <section id="how-it-works" className="py-16 lg:py-24 bg-background">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto">
                         <h2 className="text-3xl font-bold font-headline">How It Works</h2>
                        <p className="mt-4 text-muted-foreground">
                           Hover over any feature to see a quick demo of how Shopiggo streamlines your shopping experience.
                        </p>
                    </div>
                    <div className="mt-10 max-w-4xl mx-auto">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
                             <iframe 
                                src="https://www.youtube.com/embed/A9XC8oijQqU" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section id="features" className="py-16 lg:py-24 bg-muted/50">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold font-headline">Your Ultimate Shopping Toolkit</h2>
                        <p className="mt-4 text-muted-foreground">
                            Tired of juggling multiple tabs and missing out on the best prices? Shopiggo brings all your favorite stores into one place, simplified with a unified cart and an AI assistant to guide you.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                         <FeatureCard 
                            icon={<Search className="w-8 h-8"/>}
                            title="Multi-Store Search"
                            description="Find what you're looking for across 30+ major retailers instantly. Compare prices and options with ease."
                            isSearch={true}
                            demoContent={<MultiStoreSearchDemo />}
                        />
                        <FeatureCard 
                            icon={<Bot className="w-8 h-8"/>}
                            title="Pixi AI Assistant"
                            description="Get expert buying advice, product explanations, and personalized suggestions from our friendly AI."
                            demoContent={<PixiAiDemo />}
                        />
                         <FeatureCard 
                            icon={<Package2 className="w-8 h-8"/>}
                            title="Unified Cart"
                            description="Add items from different stores to one cart and checkout with a single, secure payment."
                            demoContent={<UnifiedCartDemo />}
                        />
                         <FeatureCard 
                            icon={<Bell className="w-8 h-8"/>}
                            title="Price Drop Alerts"
                            description="Get notified when prices drop. Higher tiers can even auto-purchase at the perfect moment."
                            demoContent={<PriceAlertDemo />}
                        />
                        <FeatureCard 
                            icon={<Coins className="w-8 h-8"/>}
                            title="GoCoins Rewards"
                            description="Earn loyalty points on every purchase and redeem them for discounts and other perks."
                            demoContent={<GoCoinsDemo />}
                        />
                         <FeatureCard 
                            icon={<Ticket className="w-8 h-8"/>}
                            title="Consolidated Coupons"
                            description="View and apply coupons from all your favorite retailers in one convenient location."
                            demoContent={<ConsolidatedCouponsDemo />}
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-8 h-8"/>}
                            title="Tiered Memberships"
                            description="Unlock exclusive benefits like higher cashback, premium support, and early access to deals."
                            demoContent={<TieredMembershipsDemo />}
                        />
                        <FeatureCard
                            icon={<Settings className="w-8 h-8"/>}
                            title="Personalized Shopping"
                            description="Set your favorite brands and categories to receive tailored recommendations and deals from Pixi AI."
                            demoContent={<PersonalizedShoppingDemo />}
                        />
                    </div>
                </div>
            </section>

             {/* Future of Shopping Section */}
            <section className="py-16 lg:py-24 bg-background">
                <div className="container">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold font-headline">The Future of Shopping is Here</h2>
                        <p className="mt-4 text-muted-foreground">
                            Step into the next dimension of retail with our groundbreaking XR and Multiverse shopping experiences, currently in development.
                        </p>
                        <Badge variant="outline" className="mt-4">Coming Soon</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
                        <FeatureCard 
                            icon={<View className="w-8 h-8"/>}
                            title="XR Product Viewer"
                            description="Use your mobile device or smart glasses to see how products look in your own space before you buy. From furniture to fashion, experience true-to-scale augmented reality models."
                            demoContent={<XrProductViewerDemo />}
                        />
                        <FeatureCard 
                            icon={<Store className="w-8 h-8"/>}
                            title="Multiverse Shopping"
                            description="Login to your account in virtual reality and explore an infinite store that transcends physical limitations. Browse endless aisles from all your favorite brands, test products virtually, and place orders in a stunning, immersive environment."
                            demoContent={<MultiverseShoppingDemo />}
                        />
                    </div>
                </div>
            </section>
            
             {/* Membership Section */}
            <section id="pricing" className="py-20 lg:py-32 bg-secondary/30">
                <div className="container">
                     <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline">Membership Plans</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Choose the plan that's right for you and unlock a new level of shopping convenience.
                        </p>
                         <Badge variant="destructive" className="mt-6 text-base">
                            Labor Day Promo: First 90 Days FREE on all plans! (Ends Sept 2nd)
                        </Badge>
                    </div>

                    <div className="flex items-center justify-center gap-4 my-10">
                        <Label htmlFor="billing-cycle-main">Monthly</Label>
                        <Switch id="billing-cycle-main" checked={isAnnual} onCheckedChange={setIsAnnual} />
                        <Label htmlFor="billing-cycle-main">Annual</Label>
                        <span className="text-sm font-medium text-primary">(Save ~17%)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {membershipTiers.slice(0, 6).map(tier => (
                            <Card key={tier.name} className={cn("flex flex-col h-full", tier.isPopular && "border-primary border-2 shadow-lg")}>
                                <CardHeader>
                                    <div className="relative">
                                        <CardTitle className="font-headline">{tier.name}</CardTitle>
                                        {tier.isPopular && <Badge variant="destructive" className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">Most Popular</Badge>}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-6">
                                     <div className="flex items-baseline gap-2">
                                        {!isAnnual && tier.name !== 'Free' ? (
                                            <>
                                                <span className="text-4xl font-bold">$0</span>
                                                <span className="text-2xl font-bold text-muted-foreground line-through">${tier.monthlyPrice.toFixed(2)}</span>
                                                 <span className="text-sm font-normal text-muted-foreground">
                                                    /mo
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
                                     <Link href="/membership" className="w-full">
                                        <Button className="w-full" variant={tier.isPopular ? 'default' : 'outline'}>
                                            Choose Plan
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <Link href="/membership">
                            <Button variant="ghost">See All Plans & Features <ArrowRight className="ml-2" /></Button>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Call to Action Section */}
             <section className="py-20 lg:py-32">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold font-headline">Ready to Revolutionize Your Shopping?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Join Shopiggo today for free and start discovering a better way to shop online.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                       <Button size="lg" asChild>
                           <Link href="/signup">
                                Sign Up for Free <ArrowRight className="ml-2 h-5 w-5" />
                           </Link>
                        </Button>
                         <Button size="lg" variant="outline" asChild>
                            <Link href="/membership">
                                View Membership Plans
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
