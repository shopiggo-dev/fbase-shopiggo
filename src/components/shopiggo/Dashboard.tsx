
// src/components/shopiggo/Dashboard.tsx
'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { User, Bell, Gem, Shield, CreditCard, MapPin, Settings, Users, Coins, Ticket, History, BarChart, Bot, Sparkles, UserRoundCog } from "lucide-react";
import { cn } from '@/lib/utils';
import { ProfileSettings } from '@/components/shopiggo/ProfileSettings';
import { NotificationSettings } from '@/components/shopiggo/NotificationSettings';
import { MembershipSettings } from '@/components/shopiggo/MembershipSettings';
import { SecuritySettings } from '@/components/shopiggo/SecuritySettings';
import { PaymentSettings } from '@/components/shopiggo/PaymentSettings';
import { AddressSettings } from '@/components/shopiggo/AddressSettings';
import { ShoppingPreferences } from '@/components/shopiggo/ShoppingPreferences';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ContactSettings } from './ContactSettings';
import { useUser } from '@/hooks/use-user';


const NavButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <Button
        variant="ghost"
        className={cn(
            "w-full justify-start",
            active && "bg-primary/10 text-primary"
        )}
        onClick={onClick}
    >
        {children}
    </Button>
);

const getInitialSection = (tab: string | null): AccountSection => {
    const validTabs: AccountSection[] = ['profile', 'contacts', 'gocoins', 'gocoupons', 'notifications', 'membership', 'security', 'payment', 'address', 'preferences', 'analytics', 'orders', 'pixi-history', 'ai-agents'];
    if (tab && validTabs.includes(tab as AccountSection)) {
        return tab as AccountSection;
    }
    return 'profile';
};

type AccountSection = 'profile' | 'contacts' | 'gocoins' | 'gocoupons' | 'notifications' | 'membership' | 'security' | 'payment' | 'address' | 'preferences' | 'analytics' | 'orders' | 'pixi-history' | 'ai-agents';


function DashboardComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useUser();
    const tabQuery = searchParams.get('tab');
    const [activeSection, setActiveSection] = useState<AccountSection>(() => getInitialSection(tabQuery));

    useEffect(() => {
        const currentSection = getInitialSection(tabQuery);
        setActiveSection(currentSection);
    }, [tabQuery]);
    
    const handleSectionChange = (section: AccountSection) => {
        setActiveSection(section);
        router.push(`/dashboard?tab=${section}`);
    };
    
    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return <ProfileSettings />;
            case 'contacts':
                return <ContactSettings />;
            case 'gocoins':
            case 'gocoupons':
            case 'orders':
            case 'analytics':
            case 'pixi-history':
            case 'ai-agents':
                 return <AnalyticsDashboard />;
            case 'notifications':
                return <NotificationSettings />;
            case 'membership':
                return <MembershipSettings />;
            case 'security':
                return <SecuritySettings />;
            case 'payment':
                return <PaymentSettings />;
            case 'address':
                return <AddressSettings />;
            case 'preferences':
                return <ShoppingPreferences />;
            default:
                return <ProfileSettings />;
        }
    }

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8 font-headline">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <nav className="lg:col-span-1">
                    <ul className="space-y-2">
                        <li><h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</h4></li>
                        <li><NavButton active={activeSection === 'profile'} onClick={() => handleSectionChange('profile')}><User className="mr-2" /> Profile</NavButton></li>
                        <li><NavButton active={activeSection === 'contacts'} onClick={() => handleSectionChange('contacts')}><Users className="mr-2" /> Contacts</NavButton></li>
                        <li><NavButton active={activeSection === 'membership'} onClick={() => handleSectionChange('membership')}><Gem className="mr-2" /> Membership</NavButton></li>
                        <li><NavButton active={activeSection === 'security'} onClick={() => handleSectionChange('security')}><Shield className="mr-2" /> Security</NavButton></li>

                        <li className="pt-4"><h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Shopping</h4></li>
                        <li><NavButton active={activeSection === 'orders'} onClick={() => handleSectionChange('orders')}><History className="mr-2" /> Order History</NavButton></li>
                        <li><NavButton active={activeSection === 'gocoins'} onClick={() => handleSectionChange('gocoins')}><Coins className="mr-2" /> GoCoins</NavButton></li>
                        <li><NavButton active={activeSection === 'gocoupons'} onClick={() => handleSectionChange('gocoupons')}><Ticket className="mr-2" /> GoCoupons</NavButton></li>
                        <li><NavButton active={activeSection === 'payment'} onClick={() => handleSectionChange('payment')}><CreditCard className="mr-2" /> Payment Options</NavButton></li>
                        <li><NavButton active={activeSection === 'address'} onClick={() => handleSectionChange('address')}><MapPin className="mr-2" /> Delivery Addresses</NavButton></li>
                        
                        <li className="pt-4"><h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI & Personalization</h4></li>
                        <li><NavButton active={activeSection === 'preferences'} onClick={() => handleSectionChange('preferences')}><Settings className="mr-2" /> Shopping Preferences</NavButton></li>
                        <li><NavButton active={activeSection === 'pixi-history'} onClick={() => handleSectionChange('pixi-history')}><Bot className="mr-2" /> Pixi Chat History</NavButton></li>
                        <li><NavButton active={activeSection === 'ai-agents'} onClick={() => handleSectionChange('ai-agents')}><UserRoundCog className="mr-2" /> AI Agents</NavButton></li>
                        <li><NavButton active={activeSection === 'analytics'} onClick={() => handleSectionChange('analytics')}><BarChart className="mr-2" /> Analytics</NavButton></li>
                    </ul>
                </nav>

                <main className="lg:col-span-3">
                    {renderSection()}
                </main>
            </div>
        </div>
    )
}

export function Dashboard() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardComponent />
        </Suspense>
    )
}
