'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { CheckCircle, MailCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailConfirmedPage() {
  const router = useRouter();

  // Afficher un message de succès immédiatement après le chargement
  useEffect(() => {
    // Optionnel: Ajouter un toast de succès si le système de toast est disponible
  }, []);

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
                fr="Vous pouvez maintenant vous connecter à votre compte." 
                en="You can now log in to your account."
              >
                Sie können sich jetzt in Ihr Konto einloggen.
              </TranslatedText>
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/login">
                <TranslatedText 
                  fr="Se connecter à mon compte" 
                  en="Log In to My Account"
                >
                  In mein Konto einloggen
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