
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
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, type UserCredential, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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


const handleUserProfileCreation = async (userCredential: UserCredential, firestore: any, name: string) => {
    const user = userCredential.user;
    if (!user || !firestore) return;

    const userRef = doc(firestore, 'userProfiles', user.uid);
    try {
        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            firstName: name.split(' ')[0] || '',
            lastName: name.split(' ').slice(1).join(' ') || '',
            photoURL: user.photoURL || '',
            isAdmin: false, // Default to non-admin
        }, { merge: true });
    } catch (e: any) {
         const permissionError = new FirestorePermissionError({
          path: `userProfiles/${user.uid}`,
          operation: 'create',
          requestResourceData: { id: user.uid, email: user.email },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw e; // Re-throw to be caught by the calling function
    }
};

export default function RegisterPageClient() {
  const { auth, firestore } = useFirebase();
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
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Firebase services are not available.",
      });
      return;
    }

    try {
      // Step 1: Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Step 2: Update the display name in Auth
      await updateProfile(user, { displayName: data.name });
      
      // Step 3: Create the user profile document in Firestore
      await handleUserProfileCreation(userCredential, firestore, data.name);
      
      // Step 4: Send the verification email
      await sendEmailVerification(user);

      toast({
          title: language === 'fr' ? 'Inscription réussie !' : language === 'en' ? 'Registration Successful!' : 'Registrierung erfolgreich!',
          description: language === 'fr' ? 'Un lien de vérification a été envoyé à votre adresse e-mail.' : language === 'en' ? 'A verification link has been sent to your email address.' : 'Ein Bestätigungslink wurde an Ihre E-Mail-Adresse gesendet.',
      });
      
      // Step 5: Redirect the user to the verification page
      router.push('/verify-email');

    } catch (error: any) {
       let errorMessage: string;
       switch (error.code) {
         case 'auth/email-already-in-use':
           errorMessage = language === 'fr' ? 'Cette adresse e-mail est déjà utilisée.' : language === 'en' ? 'This email address is already in use.' : 'Diese E-Mail-Adresse wird bereits verwendet.';
           break;
         case 'auth/weak-password':
           errorMessage = language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères.' : language === 'en' ? 'Password must be at least 6 characters.' : 'Das Passwort muss mindestens 6 Zeichen lang sein.';
           break;
        case 'auth/invalid-email':
           errorMessage = language === 'fr' ? 'L\'adresse e-mail est invalide.' : language === 'en' ? 'The email address is invalid.' : 'Die E-Mail-Adresse ist ungültig.';
           break;
         default:
           errorMessage = language === 'fr' ? 'Une erreur est survenue lors de l\'inscription.' : language === 'en' ? 'An error occurred during registration.' : 'Bei der Registrierung ist ein Fehler aufgetreten.';
           console.error("Signup error:", error);
           break;
       }
      
      toast({
        variant: 'destructive',
        title: language === 'fr' ? 'Échec de l\'inscription' : language === 'en' ? 'Registration Failed' : 'Registrierung fehlgeschlagen',
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
                <h2 className="mb-6 text-2xl font-semibold"><TranslatedText fr="Créer un compte" en="Create an Account">Créer un compte</TranslatedText></h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel><TranslatedText fr="Nom complet" en="Full Name">Nom complet</TranslatedText></FormLabel>
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
                                    <FormLabel><TranslatedText fr="Email" en="Email">Email</TranslatedText></FormLabel>
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
                                    <FormLabel><TranslatedText fr="Mot de passe" en="Password">Mot de passe</TranslatedText></FormLabel>
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
                                          <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                      </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-4 rounded-full" size="lg" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <TranslatedText fr="Création..." en="Creating...">Création...</TranslatedText> : <TranslatedText fr="Créer un compte" en="Create Account">Créer un compte</TranslatedText>}
                        </Button>
                    </form>
                </Form>
                
                <div className="mt-6 text-center text-sm">
                    <p className="text-muted-foreground">
                        <TranslatedText fr="Vous avez déjà un compte ?" en="Already have an account?">Vous avez déjà un compte ?</TranslatedText>{' '}
                        <Link href="/login" className="font-semibold text-foreground hover:underline">
                            <TranslatedText fr="Se connecter" en="Log In">Se connecter</TranslatedText>
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
