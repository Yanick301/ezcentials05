
'use client';

import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslatedText } from '@/components/TranslatedText';
import { useSupabase } from '@/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';


const loginSchemaFR = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis.' }),
});
const loginSchemaDE = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse.' }),
  password: z.string().min(1, { message: 'Passwort ist erforderlich.' }),
});
const loginSchemaEN = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});


export default function LoginPageClient() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const currentSchema = language === 'fr' ? loginSchemaFR : language === 'en' ? loginSchemaEN : loginSchemaDE;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof currentSchema>> = async (data) => {
    if (!supabase) return;
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (signInError) {
        throw signInError;
      }

      // Vérifier si l'email est vérifié
      if (authData.user && !authData.user.email_confirmed_at) {
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Vérification requise" en="Verification Required">Bestätigung erforderlich</TranslatedText>,
            description: <TranslatedText fr="Veuillez vérifier votre e-mail avant de vous connecter." en="Please verify your email before logging in.">Bitte bestätigen Sie Ihre E-Mail, bevor Sie sich anmelden.</TranslatedText>,
        });
        router.push('/verify-email');
        return;
      }

      // Le profil utilisateur est créé automatiquement par le trigger SQL
      // Vérifier s'il existe, sinon le créer
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Le profil n'existe pas, le créer
        const { error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email || '',
            first_name: (authData.user.user_metadata?.first_name as string) || '',
            last_name: (authData.user.user_metadata?.last_name as string) || '',
            photo_url: (authData.user.user_metadata?.photo_url as string) || null,
            is_admin: false,
          } as any);

        if (createError) {
          console.error('Error creating profile:', createError);
        }
      }
      
      toast({
          title: <TranslatedText fr="Connexion réussie" en="Login Successful">Anmeldung erfolgreich</TranslatedText>,
          description: <TranslatedText fr="Bienvenue à nouveau !" en="Welcome back!">Willkommen zurück!</TranslatedText>,
      });
      
      const redirectUrl = searchParams.get('redirect') || '/account';
      router.push(redirectUrl);
      router.refresh();

    } catch (error: any) {
      let errorMessage: React.ReactNode = <TranslatedText fr="Une erreur est survenue lors de la connexion." en="An error occurred during login.">Bei der Anmeldung ist ein Fehler aufgetreten.</TranslatedText>;
      if (error.message?.includes('Invalid login credentials') || error.message?.includes('Email not confirmed')) {
          errorMessage = <TranslatedText fr="Email ou mot de passe incorrect." en="Incorrect email or password.">Falsche E-Mail oder falsches Passwort.</TranslatedText>;
      }
      console.error("Login failed:", error);
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Échec de la connexion" en="Login Failed">Anmeldung fehlgeschlagen</TranslatedText>,
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
            <h1 className="font-headline text-5xl tracking-tighter">EZCENTIALS</h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground"><TranslatedText fr="COLLECTION PREMIUM" en="PREMIUM COLLECTION">PREMIUM COLLECTION</TranslatedText></p>
        </div>

        <Card className="w-full max-w-sm rounded-2xl border-none shadow-lg">
            <CardContent className="p-8">
                <h2 className="mb-6 text-2xl font-semibold"><TranslatedText fr="Connexion" en="Log In">Anmelden</TranslatedText></h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type="email" {...field} className="border-0 bg-input" autoComplete="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel><TranslatedText fr="Mot de passe" en="Password">Passwort</TranslatedText></FormLabel>
                                </div>
                                <div className="relative">
                                    <FormControl>
                                        <Input type={showPassword ? 'text' : 'password'} {...field} className="border-0 bg-input pr-10" autoComplete="current-password" />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute inset-y-0 right-0 h-full px-3"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                        <span className="sr-only">
                                            <TranslatedText fr={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} en={showPassword ? "Hide password" : "Show password"}>
                                                {showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                                            </TranslatedText>
                                        </span>
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4 w-full rounded-full" size="lg" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <TranslatedText fr="Connexion..." en="Logging in...">Anmelden...</TranslatedText> : <TranslatedText fr="Se connecter" en="Log In">Anmelden</TranslatedText>}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                        <TranslatedText fr="Pas encore de compte ?" en="Don't have an account yet?">Noch kein Konto?</TranslatedText>{' '}
                        <Link href="/register" className="font-semibold text-foreground hover:underline">
                            <TranslatedText fr="S'inscrire" en="Sign up">Registrieren</TranslatedText>
                        </Link>
                    </p>
                     <Link
                        href="/forgot-password"
                        className="mt-2 inline-block text-sm text-muted-foreground hover:underline"
                    >
                        <TranslatedText fr="Mot de passe oublié ?" en="Forgot password?">Passwort vergessen?</TranslatedText>
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
