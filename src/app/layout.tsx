
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppShell } from '@/components/shopiggo/AppShell';
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserProvider } from '@/contexts/UserContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Shopiggo - Your AI Shopping Assistant',
  description: 'Search across stores, get AI-powered advice, and enjoy a unified shopping experience with a single cart. Compare prices, find deals, and shop smarter with Shopiggo.',
  openGraph: {
    title: 'Shopiggo - Your AI Shopping Assistant',
    description: 'The future of online shopping. Search, compare, and buy from all your favorite stores in one place.',
    url: 'https://www.shopiggo.com',
    siteName: 'Shopiggo',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopiggo - Your AI Shopping Assistant',
    description: 'The future of online shopping. Search, compare, and buy from all your favorite stores in one place.',
    images: ['https://placehold.co/1200x630.png'], // Replace with your actual Twitter image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FF7A00" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://placehold.co/180x180.png" data-ai-hint="logo icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://placehold.co/32x32.png" data-ai-hint="logo icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://placehold.co/16x16.png" data-ai-hint="logo icon" />
        <meta name='impact-site-verification' value='5e804e6e-fa91-47fb-82c2-03a5d8948dfe' />
        <meta name='impact-site-verification' value='0f0070a2-e6eb-499a-b1f9-fbe5e23086f5' />
        <meta name="fo-verify" content="5ed3cfc5-b4ef-4ab3-98ca-a8e6fc9ce278" />
        {/* Google Tag Manager for www.shopiggo.com */}
        <Script id="gtm-script-www" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TMV79DGV');
          `}
        </Script>
        {/* End Google Tag Manager */}
        {/* Google Tag Manager for shopiggo.com */}
        <Script id="gtm-script-non-www" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NC38556J');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="font-body antialiased">
        {/* Google Tag Manager (noscript) for www.shopiggo.com */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TMV79DGV"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Google Tag Manager (noscript) for shopiggo.com */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NC38556J"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}

        <UserProvider>
          <LanguageProvider>
            <CartProvider>
                <AppShell>{children}</AppShell>
            </CartProvider>
          </LanguageProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
