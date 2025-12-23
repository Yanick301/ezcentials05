
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/AppProviders';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { DynamicLang } from '@/components/DynamicLang';
import { CookieConsent } from '@/components/CookieConsent';
import { Analytics } from '@/components/Analytics';
import { AccessibilityEnhancer } from '@/components/Accessibility';
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
  description: 'Understated elegance and sophistication. Luxury fashion boutique offering premium clothing, accessories, and seasonal collections.',
  keywords: ['luxury fashion', 'premium clothing', 'boutique', 'elegance', 'sophistication'],
  icons: {
    icon: [
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['fr_FR', 'en_GB'],
    siteName: 'EZCENTIALS',
    title: 'EZCENTIALS',
    description: 'Understated elegance and sophistication. Luxury fashion boutique offering premium clothing, accessories, and seasonal collections.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'EZCENTIALS Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EZCENTIALS',
    description: 'Understated elegance and sophistication. Luxury fashion boutique offering premium clothing, accessories, and seasonal collections.',
    images: ['/images/logo.png'],
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
        <AppProviders>
          <AccessibilityEnhancer />
          <Analytics 
            gaId={process.env.NEXT_PUBLIC_GA_ID}
            plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          />
          <DynamicLang />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>{children}</main>
            <Footer />
          </div>
          <Toaster />
          <CookieConsent />
        </AppProviders>
      </body>
    </html>
  );
}
