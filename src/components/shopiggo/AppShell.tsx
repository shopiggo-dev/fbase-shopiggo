
"use client"

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/shopiggo/Footer';
import { Header } from './Header';
import { PixiChat } from './PixiChat';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/signup/membership' || pathname === '/signup/payment' || pathname === '/signup/verify';
  const isHomePage = pathname === '/';
  
  if (isAuthPage) {
    return <div className="bg-background">{children}</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isHomePage ? 'bg-background -mt-24' : 'bg-secondary/30'}`}>
          {children}
      </main>
      <Footer />
      <PixiChat />
    </div>
  )
}
