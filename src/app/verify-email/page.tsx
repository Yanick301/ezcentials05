
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { useSupabase, useUser } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const { supabase } = useSupabase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  // This effect will run when the user's auth state changes.
  // If their email becomes verified, it will redirect them.
  useEffect(() => {
    // We check `user` directly. If it exists and email_confirmed_at is set, we redirect.
    if (user?.email_confirmed_at) {
      toast({
        title: <TranslatedText fr="Compte vérifié !" en="Account Verified!">Konto bestätigt!</TranslatedText>,
        description: <TranslatedText fr="Vous allez être redirigé..." en="Redirecting...">Sie werden weitergeleitet...</TranslatedText>,
      });
      router.push('/account');
    }
  }, [user, language, router, toast]);

  const handleResendEmail = async () => {
    if (!supabase) {
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Erreur de configuration" en="Configuration Error">Konfigurationsfehler</TranslatedText>,
            description: <TranslatedText fr="Les services Supabase ne sont pas disponibles." en="Supabase services are not available.">Supabase-Dienste sind nicht verfügbar.</TranslatedText>,
        });
        return;
    }
    
    if (!user || !user.email) {
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
            description: <TranslatedText fr="Aucun utilisateur connecté." en="No user logged in.">Kein Benutzer angemeldet.</TranslatedText>,
        });
        return;
    }
    
    setIsResending(true);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: <TranslatedText fr="E-mail renvoyé" en="Email Resent">E-Mail erneut gesendet</TranslatedText>,
        description: <TranslatedText fr="Un nouveau lien de vérification a été envoyé à votre adresse e-mail." en="A new verification link has been sent to your email address.">Ein neuer Bestätigungslink wurde an Ihre E-Mail-Adresse gesendet.</TranslatedText>,
      });
    } catch (error: any) {
      console.error('Error resending confirmation email:', error);
      const errorMessage = error.message || (
        language === 'fr' ? 'Une erreur s\'est produite lors de l\'envoi de l\'e-mail.' : 
        language === 'en' ? 'An error occurred while sending the email.' : 
        'Beim Senden der E-Mail ist ein Fehler aufgetreten.'
      );
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: errorMessage,
      });
    } finally {
        setIsResending(false);
    }
  };

  // While supabase is checking auth state, we can show a simple loader.
  if (isUserLoading) {
      return (
          <div className="flex min-h-[80vh] items-center justify-center">
              <p>
                <TranslatedText fr="Chargement..." en="Loading...">Laden...</TranslatedText>
              </p>
          </div>
      )
  }

  // If user is already verified (e.g. they came back to this page), they'll be redirected by the useEffect.
  // We can show a message while that happens.
  if (user?.email_confirmed_at) {
       return (
          <div className="flex min-h-[80vh] items-center justify-center">
              <p><TranslatedText fr="Compte déjà vérifié. Redirection..." en="Account already verified. Redirecting...">Konto bereits bestätigt. Weiterleitung...</TranslatedText></p>
          </div>
      )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4 text-2xl font-headline">
            <TranslatedText fr="Vérifiez votre adresse e-mail" en="Verify Your Email Address">Bestätigen Sie Ihre E-Mail-Adresse</TranslatedText>
          </CardTitle>
          <CardDescription>
            <TranslatedText fr="Nous avons envoyé un lien de vérification à votre adresse e-mail. Veuillez cliquer sur ce lien pour activer votre compte. Si vous n'avez rien reçu, vérifiez votre dossier de courrier indésirable." en="We've sent a verification link to your email address. Please click that link to activate your account. If you didn't receive anything, check your spam folder.">
              Wir haben einen Bestätigungslink an Ihre E-Mail-Adresse gesendet. Bitte klicken Sie auf diesen Link, um Ihr Konto zu aktivieren. Wenn Sie nichts erhalten haben, überprüfen Sie Ihren Spam-Ordner.
            </TranslatedText>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={handleResendEmail} className="w-full" disabled={isResending}>
            {isResending 
                ? <TranslatedText fr="Envoi en cours..." en="Resending...">Erneutes Senden...</TranslatedText>
                : <TranslatedText fr="Renvoyer l'e-mail de vérification" en="Resend Verification Email">Bestätigungs-E-Mail erneut senden</TranslatedText>
            }
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/login"><TranslatedText fr="Retour à la connexion" en="Back to Login">Zurück zum Login</TranslatedText></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
