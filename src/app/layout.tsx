
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Suspense } from 'react';
import { AppProviders } from '@/components/AppProviders';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { DynamicLang } from '@/components/DynamicLang';
import { CookieConsent } from '@/components/CookieConsent';
import { Analytics } from '@/components/Analytics';
import { AccessibilityEnhancer } from '@/components/Accessibility';
import { SmartsuppChat } from '@/components/SmartsuppChat';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant-garamond',
});

export const metadata: Metadata = {
  title: {
    default: 'EZCENTIALS',
    template: '%s | EZCENTIALS',
  },
  description: 'Zurückhaltende Eleganz und Raffinesse. Luxus-Modeboutique mit hochwertiger Kleidung, Accessoires und saisonalen Kollektionen.',
  keywords: ['Luxusmode', 'Premium-Kleidung', 'Boutique', 'Eleganz', 'Raffinesse', 'luxury fashion', 'premium clothing', 'boutique', 'elegance', 'sophistication'],
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['fr_FR', 'en_GB'],
    siteName: 'EZCENTIALS',
    title: 'EZCENTIALS',
    description: 'Zurückhaltende Eleganz und Raffinesse.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZCENTIALS',
    description: 'Zurückhaltende Eleganz und Raffinesse.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className="light">
      <body
        className={cn(
          'font-body antialiased',
          inter.variable,
          cormorantGaramond.variable
        )}
      >
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17302770158"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17302770158');
          `}
        </Script>
        
        <SmartsuppChat />
        <AppProviders>
          <AccessibilityEnhancer />
          <Analytics 
            gaId={process.env.NEXT_PUBLIC_GA_ID}
            plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          />
          <DynamicLang />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <Suspense fallback={null}>
              <main id="main-content" className="flex-grow" tabIndex={-1}>{children}</main>
            </Suspense>
            <Footer />
          </div>
          <Toaster />
          <CookieConsent />
        </AppProviders>
        <noscript>
          {' '}Powered by{' '}
          <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
            Smartsupp
          </a>
        </noscript>
      </body>
    </html>
  );
}
