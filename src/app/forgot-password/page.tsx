
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
import { Input } from '@/components/ui/input';
import { TranslatedText } from '@/components/TranslatedText';
import { useSupabase } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLanguage } from '@/context/LanguageContext';


const forgotPasswordSchemaDE = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse.' }),
});
const forgotPasswordSchemaFR = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
});
const forgotPasswordSchemaEN = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});


export default function ForgotPasswordPage() {
    const { supabase } = useSupabase();
    const { toast } = useToast();
    const { language } = useLanguage();

    const currentSchema = language === 'fr' ? forgotPasswordSchemaFR : language === 'en' ? forgotPasswordSchemaEN : forgotPasswordSchemaDE;

    const form = useForm<z.infer<typeof currentSchema>>({
        resolver: zodResolver(currentSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof currentSchema>> = async (data) => {
        if (!supabase) {
            toast({
                variant: "destructive",
                title: <TranslatedText fr="Erreur de configuration" en="Configuration Error">Konfigurationsfehler</TranslatedText>,
                description: <TranslatedText fr="Les services Supabase ne sont pas disponibles." en="Supabase services are not available.">Supabase-Dienste sind nicht verfügbar.</TranslatedText>,
            });
            return;
        }
        
        try {
            // Supabase enverra automatiquement un email de réinitialisation
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
            const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
                redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
            });
            
            if (error) {
                throw error;
            }
            
            toast({
                title: <TranslatedText fr="E-mail envoyé" en="Email Sent">E-Mail gesendet</TranslatedText>,
                description: <TranslatedText fr="Vérifiez votre boîte de réception pour le lien de réinitialisation du mot de passe." en="Check your inbox for the password reset link.">Überprüfen Sie Ihren Posteingang für den Link zum Zurücksetzen des Passworts.</TranslatedText>,
            });
        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
                description: error.message || (
                    <TranslatedText fr="Une erreur s'est produite." en="An error occurred.">Ein Fehler ist aufgetreten.</TranslatedText>
                ),
            });
        }
    };


  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            <TranslatedText fr="Mot de passe oublié" en="Forgot Password">Passwort vergessen</TranslatedText>
          </CardTitle>
          <CardDescription>
            <TranslatedText fr="Entrez votre e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe." en="Enter your email and we'll send you a link to reset your password.">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
            </TranslatedText>
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel><TranslatedText fr="Email" en="Email">Email</TranslatedText></FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? <TranslatedText fr="Envoi..." en="Sending...">Senden...</TranslatedText> : <TranslatedText fr="Envoyer le lien de réinitialisation" en="Send Reset Link">Link zum Zurücksetzen senden</TranslatedText>}
                    </Button>
                </form>
            </Form>
          <Button variant="ghost" asChild className="mt-4 w-full">
            <Link href="/login"><TranslatedText fr="Retour à la connexion" en="Back to Login">Zurück zum Login</TranslatedText></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
