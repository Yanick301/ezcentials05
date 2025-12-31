'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { CheckCircle, MailCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Afficher un message de succès immédiatement après le chargement
  useEffect(() => {
    // Afficher un toast de succès
    toast({
      title: <TranslatedText fr="Email confirmé !" en="Email Confirmed!">E-Mail erfolgreich bestätigt!</TranslatedText>,
      description: <TranslatedText fr="Votre email a été validé avec succès et vous êtes maintenant connecté à votre compte." en="Your email has been successfully validated and you are now logged into your account.">Ihre E-Mail-Adresse wurde erfolgreich bestätigt und Sie sind jetzt in Ihrem Konto angemeldet.</TranslatedText>,
    });
    
    // Rediriger automatiquement vers le compte après 3 secondes
    const timer = setTimeout(() => {
      router.push('/account');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router, toast]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4 text-2xl font-headline">
            <TranslatedText 
              fr="Email confirmé avec succès !" 
              en="Email Confirmed Successfully!"
            >
              E-Mail erfolgreich bestätigt!
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              <TranslatedText 
                fr="Votre adresse e-mail a été vérifiée avec succès." 
                en="Your email address has been successfully verified."
              >
                Ihre E-Mail-Adresse wurde erfolgreich bestätigt.
              </TranslatedText>
            </p>
            <p className="text-muted-foreground">
              <TranslatedText 
                fr="Vous êtes maintenant connecté à votre compte." 
                en="You are now logged into your account."
              >
                Sie sind jetzt in Ihrem Konto angemeldet.
              </TranslatedText>
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <TranslatedText 
                  fr="Redirection vers votre compte dans quelques instants..." 
                  en="Redirecting to your account shortly..."
                >
                  Weiterleitung zu Ihrem Konto erfolgt in Kürze...
                </TranslatedText>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full" variant="outline">
              <Link href="/account">
                <TranslatedText 
                  fr="Accéder à mon compte maintenant" 
                  en="Access My Account Now"
                >
                  Jetzt auf mein Konto zugreifen
                </TranslatedText>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <TranslatedText 
                  fr="Retour à l'accueil" 
                  en="Back to Home"
                >
                  Zurück zur Startseite
                </TranslatedText>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}