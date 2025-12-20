
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
import { useRouter } from 'next/navigation';
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


const registerSchemaFR = z.object({
    name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
    email: z.string().email({ message: 'Adresse e-mail invalide.' }),
    password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});
const registerSchemaDE = z.object({
    name: z.string().min(2, { message: 'Der Name muss mindestens 2 Zeichen enthalten.' }),
    email: z.string().email({ message: 'Ungültige E-Mail-Adresse.' }),
    password: z.string().min(6, { message: 'Das Passwort muss mindestens 6 Zeichen lang sein.' }),
});
const registerSchemaEN = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});


export default function RegisterPageClient() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const currentSchema = language === 'fr' ? registerSchemaFR : language === 'en' ? registerSchemaEN : registerSchemaDE;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
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
      const firstName = data.name.split(' ')[0] || '';
      const lastName = data.name.split(' ').slice(1).join(' ') || '';

      // Step 1: Create the user in Supabase Auth
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${siteUrl}/auth/callback?next=/account`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Step 2: Le profil utilisateur est créé automatiquement par le trigger SQL
      // Mais on peut aussi le créer manuellement si nécessaire (au cas où le trigger échoue)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          email: data.email,
          first_name: firstName,
          last_name: lastName,
          is_admin: false,
        } as any, {
          onConflict: 'id'
        });

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Error creating profile:', profileError);
      }

      toast({
          title: <TranslatedText fr="Inscription réussie !" en="Registration Successful!">Registrierung erfolgreich!</TranslatedText>,
          description: <TranslatedText fr="Un lien de vérification a été envoyé à votre adresse e-mail." en="A verification link has been sent to your email address.">Ein Bestätigungslink wurde an Ihre E-Mail-Adresse gesendet.</TranslatedText>,
      });
      
      // Step 3: Redirect the user to the verification page
      router.push('/verify-email');

    } catch (error: any) {
       let errorMessage: React.ReactNode;
       if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
           errorMessage = <TranslatedText fr="Cette adresse e-mail est déjà utilisée." en="This email address is already in use.">Diese E-Mail-Adresse wird bereits verwendet.</TranslatedText>;
       } else if (error.message?.includes('Password')) {
           errorMessage = <TranslatedText fr="Le mot de passe doit contenir au moins 6 caractères." en="Password must be at least 6 characters.">Das Passwort muss mindestens 6 Zeichen lang sein.</TranslatedText>;
       } else if (error.message?.includes('email')) {
           errorMessage = <TranslatedText fr="L'adresse e-mail est invalide." en="The email address is invalid.">Die E-Mail-Adresse ist ungültig.</TranslatedText>;
       } else {
           errorMessage = <TranslatedText fr="Une erreur est survenue lors de l'inscription." en="An error occurred during registration.">Bei der Registrierung ist ein Fehler aufgetreten.</TranslatedText>;
           console.error("Signup error:", error);
       }
      
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Échec de l'inscription" en="Registration Failed">Registrierung fehlgeschlagen</TranslatedText>,
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
                <h2 className="mb-6 text-2xl font-semibold"><TranslatedText fr="Créer un compte" en="Create an Account">Konto erstellen</TranslatedText></h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel><TranslatedText fr="Nom complet" en="Full Name">Vollständiger Name</TranslatedText></FormLabel>
                                    <FormControl>
                                        <Input {...field} className="border-0 bg-input" autoComplete="name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    <FormLabel><TranslatedText fr="Mot de passe" en="Password">Passwort</TranslatedText></FormLabel>
                                    <div className="relative">
                                      <FormControl>
                                          <Input type={showPassword ? 'text' : 'password'} {...field} className="border-0 bg-input pr-10" autoComplete="new-password"/>
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
                        <Button type="submit" className="w-full mt-4 rounded-full" size="lg" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <TranslatedText fr="Création..." en="Creating...">Erstelle...</TranslatedText> : <TranslatedText fr="Créer un compte" en="Create Account">Konto erstellen</TranslatedText>}
                        </Button>
                    </form>
                </Form>
                
                <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                        <TranslatedText fr="Vous avez déjà un compte ?" en="Already have an account?">Bereits ein Konto?</TranslatedText>{' '}
                        <Link href="/login" className="font-semibold text-foreground hover:underline">
                            <TranslatedText fr="Se connecter" en="Log In">Anmelden</TranslatedText>
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
