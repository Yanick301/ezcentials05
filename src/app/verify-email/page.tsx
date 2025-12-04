
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
import { useAuth, useUser } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  // This effect will run when the user's auth state changes.
  // If their email becomes verified, it will redirect them.
  useEffect(() => {
    // We check `user` directly. If it exists and emailVerified is true, we redirect.
    if (user?.emailVerified) {
      toast({
        title: language === 'fr' ? 'Compte vérifié !' : language === 'en' ? 'Account Verified!' : 'Konto bestätigt!',
        description: language === 'fr' ? 'Vous allez être redirigé...' : language === 'en' ? 'Redirecting...' : 'Sie werden weitergeleitet...',
      });
      router.push('/account');
    }
  }, [user, language, router, toast]);

  const handleResendEmail = async () => {
    if (!auth.currentUser) {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Kein Benutzer angemeldet.",
        });
        return;
    }
    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: language === 'fr' ? 'E-mail renvoyé' : language === 'en' ? 'Email Resent' : 'E-Mail erneut gesendet',
        description: language === 'fr' ? 'Un nouveau lien de vérification a été envoyé.' : language === 'en' ? 'A new verification link has been sent.' : 'Ein neuer Bestätigungslink wurde gesendet.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur s'est produite lors de l'envoi de l'e-mail.",
      });
    } finally {
        setIsResending(false);
    }
  };

  // While firebase is checking auth state, we can show a simple loader.
  if (isUserLoading) {
      return (
          <div className="flex min-h-[80vh] items-center justify-center">
              <p>Chargement...</p>
          </div>
      )
  }

  // If user is already verified (e.g. they came back to this page), they'll be redirected by the useEffect.
  // We can show a message while that happens.
  if (user?.emailVerified) {
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
