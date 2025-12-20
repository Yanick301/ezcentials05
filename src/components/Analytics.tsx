'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

interface AnalyticsProps {
  gaId?: string;
  plausibleDomain?: string;
}

function AnalyticsContent({ gaId, plausibleDomain }: AnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Google Analytics
    if (gaId && typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      window.gtag('config', gaId, {
        page_path: url,
      });
    }

    // Plausible Analytics
    if (plausibleDomain && typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          path: pathname,
        },
      });
    }
  }, [pathname, searchParams, gaId, plausibleDomain]);

  return null;
}

export function Analytics({ gaId, plausibleDomain }: AnalyticsProps) {
  // Scripts pour charger les analytics (chargés côté serveur)
  return (
    <>
      {gaId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
      {plausibleDomain && (
        <script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      )}
      <Suspense fallback={null}>
        <AnalyticsContent gaId={gaId} plausibleDomain={plausibleDomain} />
      </Suspense>
    </>
  );
}

// Hook pour tracker les événements
export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window === 'undefined') return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    // Plausible
    if (window.plausible) {
      window.plausible(eventName, {
        props: properties,
      });
    }
  };

  const trackPurchase = (value: number, currency: string = 'EUR', items: any[] = []) => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `order_${Date.now()}`,
        value,
        currency,
        items,
      });
    }
  };

  const trackAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
    trackEvent('add_to_cart', {
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
  };

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
  };
}


