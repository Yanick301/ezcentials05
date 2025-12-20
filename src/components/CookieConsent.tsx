'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TranslatedText } from '@/components/TranslatedText';
import { cn } from '@/lib/utils';
import { Cookie, Settings, X } from 'lucide-react';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const COOKIE_CONSENT_KEY = 'ezcentials-cookie-consent';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if consent has already been given
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) {
        // Show banner after a short delay for better UX
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Load stored preferences
        try {
          const parsed = JSON.parse(stored);
          setPreferences(parsed);
        } catch (e) {
          // Invalid stored data, show banner again
          setShowBanner(true);
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom duration-300',
        'bg-background border-t shadow-2xl'
      )}
    >
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {!showSettings ? (
          // Simple banner view
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-lg font-semibold mb-2">
                  <TranslatedText fr="Gestion des cookies" en="Cookie Management">
                    Cookie-Verwaltung
                  </TranslatedText>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <TranslatedText
                    fr="Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu. En acceptant, vous consentez à notre utilisation des cookies."
                    en="We use cookies to enhance your experience, analyze site traffic, and personalize content. By accepting, you consent to our use of cookies."
                  >
                    Wir verwenden Cookies, um Ihr Erlebnis zu verbessern, den Website-Traffic zu analysieren und Inhalte zu personalisieren. Durch die Annahme stimmen Sie unserer Verwendung von Cookies zu.
                  </TranslatedText>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="whitespace-nowrap"
              >
                <Settings className="h-4 w-4 mr-2" />
                <TranslatedText fr="Personnaliser" en="Customize">
                  Anpassen
                </TranslatedText>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="whitespace-nowrap"
              >
                <TranslatedText fr="Refuser tout" en="Reject All">
                  Alle ablehnen
                </TranslatedText>
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="whitespace-nowrap"
              >
                <TranslatedText fr="Tout accepter" en="Accept All">
                  Alle akzeptieren
                </TranslatedText>
              </Button>
            </div>
          </div>
        ) : (
          // Detailed settings view
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline text-xl font-semibold mb-2">
                  <TranslatedText fr="Paramètres des cookies" en="Cookie Settings">
                    Cookie-Einstellungen
                  </TranslatedText>
                </h3>
                <p className="text-sm text-muted-foreground">
                  <TranslatedText
                    fr="Gérez vos préférences de cookies. Vous pouvez activer ou désactiver différents types de cookies ci-dessous."
                    en="Manage your cookie preferences. You can enable or disable different types of cookies below."
                  >
                    Verwalten Sie Ihre Cookie-Einstellungen. Sie können verschiedene Cookie-Typen unten aktivieren oder deaktivieren.
                  </TranslatedText>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 border-t pt-4">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1 mr-4">
                  <h4 className="font-semibold text-sm mb-1">
                    <TranslatedText fr="Cookies nécessaires" en="Necessary Cookies">
                      Notwendige Cookies
                    </TranslatedText>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <TranslatedText
                      fr="Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés."
                      en="These cookies are essential for the website to function and cannot be disabled."
                    >
                      Diese Cookies sind für die Funktionalität der Website unerlässlich und können nicht deaktiviert werden.
                    </TranslatedText>
                  </p>
                </div>
                <Switch checked={preferences.necessary} disabled />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1 mr-4">
                  <h4 className="font-semibold text-sm mb-1">
                    <TranslatedText fr="Cookies d'analyse" en="Analytics Cookies">
                      Analyse-Cookies
                    </TranslatedText>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <TranslatedText
                      fr="Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site."
                      en="These cookies help us understand how visitors interact with our website."
                    >
                      Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.
                    </TranslatedText>
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={() => togglePreference('analytics')}
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1 mr-4">
                  <h4 className="font-semibold text-sm mb-1">
                    <TranslatedText fr="Cookies marketing" en="Marketing Cookies">
                      Marketing-Cookies
                    </TranslatedText>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <TranslatedText
                      fr="Ces cookies sont utilisés pour vous montrer des publicités pertinentes et mesurer l'efficacité des campagnes."
                      en="These cookies are used to show you relevant advertisements and measure campaign effectiveness."
                    >
                      Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen und die Effektivität von Kampagnen zu messen.
                    </TranslatedText>
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={() => togglePreference('marketing')}
                />
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1 mr-4">
                  <h4 className="font-semibold text-sm mb-1">
                    <TranslatedText fr="Cookies fonctionnels" en="Functional Cookies">
                      Funktionale Cookies
                    </TranslatedText>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    <TranslatedText
                      fr="Ces cookies permettent au site de se souvenir de vos choix et de fournir des fonctionnalités améliorées."
                      en="These cookies allow the website to remember your choices and provide enhanced features."
                    >
                      Diese Cookies ermöglichen es der Website, sich an Ihre Auswahl zu erinnern und erweiterte Funktionen bereitzustellen.
                    </TranslatedText>
                  </p>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={() => togglePreference('functional')}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="flex-1 sm:flex-none"
              >
                <TranslatedText fr="Refuser tout" en="Reject All">
                  Alle ablehnen
                </TranslatedText>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none"
              >
                <TranslatedText fr="Tout accepter" en="Accept All">
                  Alle akzeptieren
                </TranslatedText>
              </Button>
              <Button
                size="sm"
                onClick={handleSavePreferences}
                className="flex-1 sm:flex-none"
              >
                <TranslatedText fr="Enregistrer les préférences" en="Save Preferences">
                  Einstellungen speichern
                </TranslatedText>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}















