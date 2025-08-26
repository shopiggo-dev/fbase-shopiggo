
"use client";

import Link from 'next/link';
import { Menu, ShoppingCart, User, LogOut, Search, ChevronsUpDown, Globe, Coins, Ticket, Store, Gem, LayoutDashboard, ListFilter, SlidersHorizontal, Bot, Loader2, Tag, Sparkles, History, Copy, UserRoundCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { HeaderLogo } from '@/components/shopiggo/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '../ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '../ui/badge';
import { CartSheet } from './CartSheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '../ui/skeleton';
import retailerJson from '@/lib/retailers.json';
import { countries as allCountries, retailers as allRetailers } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import {
  StoreFilterDialog,
  type StoreFilterDialogProps,
} from './StoreFilterDialog';
import {
  CategoryFilterDialog,
  type CategoryFilterDialogProps,
} from './CategoryFilterDialog';
import {
  MoreFiltersSheet,
  type MoreFiltersSheetProps,
} from './MoreFiltersSheet';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { MembershipDropdown } from './MembershipDropdown';

const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'CAD', symbol: 'CA$' },
    { code: 'JPY', symbol: '¥' },
    { code: 'SAR', symbol: 'SAR' },
    { code: 'KRW', symbol: '₩' },
    { code: 'CNY', symbol: '¥' },
    { code: 'AED', symbol: 'AED' },
    { code: 'PLN', symbol: 'zł' },
    { code: 'RON', symbol: 'lei' },
    { code: 'CZK', symbol: 'Kč' },
    { code: 'MUR', symbol: '₨' },
    { code: 'AUD', symbol: 'A$' },
    { code: 'CHF', symbol: 'CHF'},
    { code: 'SEK', symbol: 'kr'},
    { code: 'NOK', symbol: 'kr'},
    { code: 'DKK', symbol: 'kr'},
    { code: 'BRL', symbol: 'R$'},
    { code: 'INR', symbol: '₹'},
    { code: 'MXN', symbol: 'Mex$'},
    { code: 'SGD', symbol: 'S$'},
    { code: 'ZAR', symbol: 'R'},
];

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'pl', name: 'Polish' },
    { code: 'ro', name: 'Romanian' },
    { code: 'cs', name: 'Czech' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese'},
    { code: 'nl', name: 'Dutch'},
];

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

const tierIcons: { [key: string]: React.ReactNode } = {
    'Diamond': <Gem className="h-4 w-4 text-blue-400" />,
    'Platinum': <Gem className="h-4 w-4 text-gray-400" />,
    'Gold': <Gem className="h-4 w-4 text-yellow-500" />,
    'Silver': <Gem className="h-4 w-4 text-slate-400" />,
    'Basic': <Gem className="h-4 w-4 text-amber-600" />,
    'Free': <User className="h-4 w-4 text-muted-foreground" />
};

const QuickAccessButtons = () => {
    const { user, isPixiChatOpen, setPixiChatOpen } = useUser();
    if (!user) return null;
    
    return (
        <div className="flex items-center gap-2">
            <Button variant="secondary" className="h-9" onClick={() => setPixiChatOpen(!isPixiChatOpen)}>
                <Bot /> Ask Pixi
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="h-9">
                        <UserRoundCog /> AI Agents
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>AI Shopping Agents</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Create New Agent</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Your Agents</DropdownMenuLabel>
                    <DropdownMenuItem>No agents created yet.</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export interface SearchAndFilterBarProps extends 
    StoreFilterDialogProps,
    CategoryFilterDialogProps,
    MoreFiltersSheetProps {
        searchTerm: string;
        setSearchTerm: (term: string) => void;
        isPixiEnabled: boolean;
        setIsPixiEnabled: (enabled: boolean) => void;
        sortBy: string;
        setSortBy: (sort: string) => void;
        handleSearchSubmit: (e: React.FormEvent) => void;
        isLoading: boolean;
    }

export function SearchAndFilterBar(props: SearchAndFilterBarProps) {
  const {
    selectedStores = [], onStoreChange = () => {}, onSelectAllStores = () => {}, onClearAllStores = () => {},
    selectedCategories = [], onCategoryChange = () => {}, onSelectAllCategories = () => {}, onClearAllCategories = () => {},
    priceRange = [0, 1200], onPriceChange = () => {},
    ratingRange = [0, 5], onRatingChange = () => {},
    reviewRange = [0, 150000], onReviewChange = () => {},
    searchTerm, setSearchTerm,
    isPixiEnabled, setIsPixiEnabled,
    sortBy, setSortBy,
    handleSearchSubmit, isLoading,
  } = props;
  const { user, userTier, hyperSearchCredits, isLoaded } = useUser();
  if (!user) return null;

  const hasUnlimitedCredits = userTier !== 'Free';

  return (
    <div className='container'>
        <div className="flex h-16 items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-grow">
                <div className="relative">
                     <Button type="submit" size="icon" variant="ghost" className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 text-primary-foreground/70 hover:bg-transparent hover:text-white">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                    <Input
                        type="search"
                        placeholder="Search products, deals, or ask Pixi AI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-background/20 placeholder:text-primary-foreground/70 border-primary-foreground/30 text-white"
                    />
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <div className="flex items-center gap-2">
                                        <Label htmlFor="pixi-switch" className="text-sm font-medium text-white cursor-pointer">
                                            Pixi AI HyperSearch
                                        </Label>
                                        <Switch
                                            id="pixi-switch"
                                            checked={isPixiEnabled}
                                            onCheckedChange={setIsPixiEnabled}
                                            disabled={hyperSearchCredits === 0 && !hasUnlimitedCredits}
                                        />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Enable AI-powered search for smarter results.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                         <Badge variant={hasUnlimitedCredits || hyperSearchCredits > 0 ? "secondary" : "destructive"}>
                            {hasUnlimitedCredits ? 'Unlimited' : `${hyperSearchCredits} Credits`}
                        </Badge>
                    </div>
                </div>
            </form>
        </div>
        <div className="flex h-16 items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                 {/* Desktop Filters */}
                <div className="sm:flex items-center gap-2 hidden">
                    <StoreFilterDialog
                    selectedStores={selectedStores}
                    onStoreChange={onStoreChange}
                    onSelectAllStores={onSelectAllStores}
                    onClearAllStores={onClearAllStores}
                    >
                    <Button variant="secondary" className="h-9">
                        <Store className="mr-2 h-4 w-4" />
                        Stores{' '}
                        {selectedStores.length > 0 && `(${selectedStores.length})`}
                    </Button>
                    </StoreFilterDialog>
                    <CategoryFilterDialog
                    selectedCategories={selectedCategories}
                    onCategoryChange={onCategoryChange}
                    onSelectAllCategories={onSelectAllCategories}
                    onClearAllCategories={onClearAllCategories}
                    >
                    <Button variant="secondary" className="h-9">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Categories{' '}
                        {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                    </Button>
                    </CategoryFilterDialog>
                    <MoreFiltersSheet {...props}>
                        <Button variant="secondary" className="h-9">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </MoreFiltersSheet>
                    <QuickAccessButtons />
                </div>
                 {/* Mobile Filter Button */}
                <div className="sm:hidden">
                    <MoreFiltersSheet {...props}>
                         <Button variant="secondary" className="h-9">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </MoreFiltersSheet>
                </div>
            </div>
             <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto sm:w-[180px] h-9 bg-secondary text-secondary-foreground border-secondary-foreground/20">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
  );
}

export function Header() {
    const [open, setOpen] = React.useState(false);
    
    const [selectedCurrency, setSelectedCurrency] = React.useState(currencies.find(c => c.code === countryData[0].currencyCode) || currencies[0]);
    const { selectedLanguage, setSelectedLanguage } = useLanguage();
    const { user, userTier, isLoaded, handleLogout, selectedCountry, setSelectedCountry, isPixiChatOpen, setPixiChatOpen } = useUser();
    const { toast } = useToast();
    
    const { cartItems } = useCart();
    
    React.useEffect(() => {
        const countryInfo = countryData.find(c => c.name === selectedCountry.name);
        if (countryInfo) {
            setSelectedLanguage(countryInfo.languageCode);
            const newCurrency = currencies.find(c => c.code === countryInfo.currencyCode) || selectedCurrency;
            setSelectedCurrency(newCurrency);
        }
    }, [selectedCountry, setSelectedLanguage, selectedCurrency]);


    const RetailersDropdown = ({ isMobile = false }) => {
        const [filteredRetailers, setFilteredRetailers] = React.useState(allRetailers);

        React.useEffect(() => {
            let newRetailers;
            if (selectedCountry.name === 'Global') {
                newRetailers = allRetailers;
            } else {
                 newRetailers = retailerJson
                    .filter(r => r.countries.some(c => c === selectedCountry.name))
                    .map(r => r.retailer);
            }
             // Remove duplicates and sort
            setFilteredRetailers([...new Set(newRetailers)].sort());
        }, [selectedCountry]);
        
        const triggerButton = isMobile ? (
            <Button variant="outline" className="w-full justify-between">
                <span>Supported Retailers</span>
                <Badge variant="secondary">{filteredRetailers.length}</Badge>
            </Button>
        ) : (
             <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
                 <Store />
                 <span className="sr-only">Supported Retailers</span>
            </Button>
        )

        return (
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip>
                         <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                {triggerButton}
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                         <TooltipContent>
                            <p>Supported Retailers ({filteredRetailers.length})</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Retailers in {selectedCountry.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-72">
                         {filteredRetailers.length > 0 ? (
                            filteredRetailers.map(retailer => (
                                <DropdownMenuItem key={retailer} className="cursor-default focus:bg-transparent">
                                    {retailer}
                                </DropdownMenuItem>
                            ))
                         ) : (
                             <DropdownMenuItem className="cursor-default focus:bg-transparent">No retailers found for this country.</DropdownMenuItem>
                         )}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    };

    const CurrencySelector = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                    <span>{selectedCurrency.code} ({selectedCurrency.symbol})</span>
                    <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Choose Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currencies.map(currency => (
                    <DropdownMenuItem key={currency.code} onSelect={() => setSelectedCurrency(currency)}>
                        {currency.code} ({currency.symbol})
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const CountrySelector = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="w-full justify-between">
                    <span>{selectedCountry.name}</span>
                    <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 overflow-y-auto">
                <DropdownMenuLabel>Choose Country</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {countryData.map(country => (
                    <DropdownMenuItem key={country.name} onSelect={() => setSelectedCountry(country)}>
                        {country.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const LanguageSelector = () => {
        const currentLanguageName = languages.find(lang => lang.code === selectedLanguage)?.name || 'English';
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="w-full justify-between">
                        <span>{currentLanguageName}</span>
                        <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Choose Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {languages.map(language => (
                        <DropdownMenuItem key={language.code} onSelect={() => setSelectedLanguage(language.code)}>
                            {language.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    const LocalizationDropdown = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Open localization settings</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Region & Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <div className="flex flex-col gap-1 p-1">
                       <CountrySelector />
                       <CurrencySelector />
                       <LanguageSelector />
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );


    const CartButton = () => {
        if (!isLoaded || !user || userTier === 'Free') return null;

        return (
            <CartSheet>
                <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative text-primary-foreground hover:text-primary-foreground/80">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{cartItems.length}</Badge>
                    )}
                </Button>
            </CartSheet>
        );
    }

    const UserMenu = () => {
        if (!isLoaded) {
            return <Skeleton className="h-10 w-24 rounded-md" />
        }

        if (!user) {
            return (
                <div className="flex items-center gap-2">
                    <Link href="/signup">
                        <Button>Sign Up</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" className="text-foreground">Login</Button>
                    </Link>
                </div>
            )
        }
        
        const userInitial = user.name?.charAt(0).toUpperCase() || 'U';

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-0">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://placehold.co/100x100?text=${userInitial}`} alt="User Avatar" />
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard"><LayoutDashboard className="mr-2" /> Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard?tab=profile"><User className="mr-2" /> My Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard?tab=orders"><History className="mr-2" /> Order History</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                     <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                         <DropdownMenuItem asChild>
                            <Link href="/dashboard?tab=membership" className="flex justify-between">
                                <div className="flex items-center">
                                    {tierIcons[userTier]}<span className="ml-2">Membership</span>
                                </div>
                                <Badge variant="destructive">{userTier}</Badge>
                            </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/dashboard?tab=gocoins" className="flex justify-between">
                                 <div className="flex items-center">
                                    <Coins className="mr-2 text-yellow-500" /><span>GoCoins</span>
                                </div>
                                <Badge variant="secondary">{user.goCoins.toFixed(2)}</Badge>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard?tab=gocoupons" className="flex justify-between">
                                <div className="flex items-center">
                                    <Ticket className="mr-2" /><span>GoCoupons</span>
                                </div>
                                <Badge variant="secondary">0</Badge>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                       <LogOut className="mr-2"/> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    const QuickAccessIcons = () => {
        if (!isLoaded || !user) return null;
        
        return (
            <div className="flex items-center">
                <MembershipDropdown fromHeader={true} />

                 <DropdownMenu>
                    <TooltipProvider>
                        <Tooltip>
                             <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300">
                                        <Coins />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent><p>GoCoins: {user.goCoins.toFixed(2)}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>GoCoins Balance</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 flex flex-col items-start gap-2">
                             <p className="text-2xl font-bold">{user.goCoins.toFixed(2)}</p>
                             <div className='text-xs text-muted-foreground'>100 GoCoins = $1.00</div>
                             <div className='flex gap-2 w-full'>
                                 <Link href="/dashboard?tab=gocoins" className="w-full">
                                    <Button size="sm" variant="ghost" className="w-full">View History</Button>
                                 </Link>
                                 <Button size="sm" className="w-full">Apply to Purchase</Button>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
                                        <Ticket />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent><p>No GoCoupons Available</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Available GoCoupons</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-2 space-y-2 text-center text-sm text-muted-foreground">
                           <p>No GoCoupons available right now.</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/dashboard?tab=gocoupons" className="w-full cursor-pointer">
                                <Button size="sm" variant="outline" className="w-full">View All GoCoupons</Button>
                           </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
            </div>
        )
    }

    return (
        <header
            className={cn(
            'dark sticky top-0 z-50 w-full transition-all duration-300 header-gradient'
            )}
        >
            <div className="container flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
                <HeaderLogo />
            </div>

            <div className="hidden md:flex items-center gap-2">
                <NavLink href="/search">Storefront</NavLink>
                {!user && <NavLink href="/hot-deals"><Tag className="mr-1 h-4 w-4"/>Hot Deals</NavLink>}
                <LocalizationDropdown />
                <RetailersDropdown />
                <QuickAccessIcons />
                <CartButton />
                <UserMenu />
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
                <CartButton />
                <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Toggle Menu" className="text-primary-foreground hover:bg-transparent hover:text-primary-foreground/80">
                    <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="right"
                    className="w-[300px] sm:w-[400px] bg-background"
                >
                    <div className="border-b pb-4 mb-4">
                    <Link
                        href="/"
                        aria-label="Shopiggo Home"
                        onClick={() => setOpen(false)}
                    >
                        <HeaderLogo />
                    </Link>
                    </div>
                    <nav className="flex flex-col gap-6 text-lg font-medium">
                    <div className="border-t pt-6 mt-4 flex flex-col gap-4">
                        {user ? (
                        <>
                            <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            >
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <User className="mr-2 h-5 w-5" /> My Profile
                            </Button>
                            </Link>
                            <Button
                            className="w-full justify-start"
                            onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }}
                            >
                            <LogOut className="mr-2 h-5 w-5" /> Logout
                            </Button>
                        </>
                        ) : (
                        <>
                            <Link href="/login" onClick={() => setOpen(false)}>
                            <Button className="w-full justify-start">
                                <User className="mr-2 h-5 w-5" /> Login
                            </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setOpen(false)}>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                Sign Up
                            </Button>
                            </Link>
                        </>
                        )}
                    </div>
                    <div className="border-t pt-6 mt-4 flex flex-col gap-4">
                        <Label>Supported Retailers</Label>
                        <RetailersDropdown isMobile={true} />
                        <Label>Region & Language</Label>
                        <CountrySelector />
                        <CurrencySelector />
                        <LanguageSelector />
                    </div>
                    </nav>
                </SheetContent>
                </Sheet>
            </div>
            </div>
        </header>
    );
}

const NavLink = ({ href, children, onClick, className }: { href: string, children: React.ReactNode, onClick?: () => void, className?: string }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary-foreground/80 flex items-center",
                isActive ? "text-primary-foreground" : "text-primary-foreground/60",
                className
            )}
        >
            {children}
        </Link>
    );
};

