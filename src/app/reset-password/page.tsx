'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabase } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslatedText } from '@/components/TranslatedText';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

const resetPasswordSchemaDE = z.object({
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Die Passwörter stimmen nicht überein.',
  path: ['confirmPassword'],
});

const resetPasswordSchemaFR = z.object({
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirmPassword'],
});

const resetPasswordSchemaEN = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchemaDE>;

function ResetPasswordForm() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  const currentSchema = language === 'fr' ? resetPasswordSchemaFR : language === 'en' ? resetPasswordSchemaEN : resetPasswordSchemaDE;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Vérifier si le token est valide au chargement
  useEffect(() => {
    const checkToken = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      // Vérifier si l'utilisateur a une session valide (après avoir cliqué sur le lien)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsValidToken(true);
      } else {
        // Si pas de session, vérifier s'il y a un code dans l'URL
        const code = searchParams.get('code');
        if (code) {
          // Le callback devrait avoir déjà échangé le code
          // Attendre un peu et vérifier à nouveau
          setTimeout(async () => {
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession) {
              setIsValidToken(true);
            } else {
              toast({
                variant: 'destructive',
                title: <TranslatedText fr="Lien invalide" en="Invalid Link">Ungültiger Link</TranslatedText>,
                description: <TranslatedText fr="Ce lien de réinitialisation est invalide ou a expiré." en="This reset link is invalid or has expired.">Dieser Link zum Zurücksetzen ist ungültig oder abgelaufen.</TranslatedText>,
              });
              router.push('/forgot-password');
            }
          }, 1000);
        } else {
          toast({
            variant: 'destructive',
            title: <TranslatedText fr="Lien invalide" en="Invalid Link">Ungültiger Link</TranslatedText>,
            description: <TranslatedText fr="Aucun code de réinitialisation trouvé. Veuillez demander un nouveau lien." en="No reset code found. Please request a new link.">Kein Code zum Zurücksetzen gefunden. Bitte fordern Sie einen neuen Link an.</TranslatedText>,
          });
          router.push('/forgot-password');
        }
      }
      setIsLoading(false);
    };

    checkToken();
  }, [supabase, searchParams, router, toast]);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    if (!supabase) {
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: <TranslatedText fr="Les services Supabase ne sont pas disponibles." en="Supabase services are not available.">Supabase-Dienste sind nicht verfügbar.</TranslatedText>,
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: <TranslatedText fr="Mot de passe mis à jour" en="Password Updated">Passwort aktualisiert</TranslatedText>,
        description: <TranslatedText fr="Votre mot de passe a été mis à jour avec succès." en="Your password has been successfully updated.">Ihr Passwort wurde erfolgreich aktualisiert.</TranslatedText>,
      });

      // Rediriger vers la page de connexion
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: error.message || (
          <TranslatedText fr="Une erreur s'est produite lors de la mise à jour du mot de passe." en="An error occurred while updating the password.">Beim Aktualisieren des Passworts ist ein Fehler aufgetreten.</TranslatedText>
        ),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isValidToken) {
    return null; // Le message d'erreur a déjà été affiché
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            <TranslatedText fr="Réinitialiser le mot de passe" en="Reset Password">
              Passwort zurücksetzen
            </TranslatedText>
          </CardTitle>
          <CardDescription>
            <TranslatedText
              fr="Entrez votre nouveau mot de passe"
              en="Enter your new password"
            >
              Geben Sie Ihr neues Passwort ein
            </TranslatedText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslatedText fr="Nouveau mot de passe" en="New Password">
                        Neues Passwort
                      </TranslatedText>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-10"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full px-3"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          <TranslatedText
                            fr={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            en={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                          </TranslatedText>
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <TranslatedText fr="Confirmer le mot de passe" en="Confirm Password">
                        Passwort bestätigen
                      </TranslatedText>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-10"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full px-3"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          <TranslatedText
                            fr={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            en={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                          </TranslatedText>
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <TranslatedText fr="Mise à jour..." en="Updating...">
                    Aktualisierung...
                  </TranslatedText>
                ) : (
                  <TranslatedText fr="Réinitialiser le mot de passe" en="Reset Password">
                    Passwort zurücksetzen
                  </TranslatedText>
                )}
              </Button>
            </form>
          </Form>
          <Button variant="ghost" asChild className="mt-4 w-full">
            <Link href="/login">
              <TranslatedText fr="Retour à la connexion" en="Back to Login">
                Zurück zum Login
              </TranslatedText>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}














