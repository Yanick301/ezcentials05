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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const otpSchemaDE = z.object({
  email: z.string().email({ message: 'Ungültige E-Mail-Adresse.' }),
  otp: z.string().length(6, { message: 'Der Code muss genau 6 Ziffern lang sein.' }),
});

const newPasswordSchemaDE = z.object({
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Die Passwörter stimmen nicht überein.',
  path: ['confirmPassword'],
});

type OtpFormValues = z.infer<typeof otpSchemaDE>;
type NewPasswordFormValues = z.infer<typeof newPasswordSchemaDE>;

function ResetPasswordForm() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const initialEmail = searchParams.get('email') || '';

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchemaDE),
    defaultValues: {
      email: initialEmail,
      otp: '',
    },
  });

  const passwordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchemaDE),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check if we already have a session (e.g. from a legacy link)
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStep('password');
      }
    };
    checkSession();
  }, [supabase]);

  const onOtpSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    if (!supabase) return;
    setIsVerifying(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.otp,
        type: 'recovery',
      });

      if (error) throw error;

      toast({
        title: "Erfolgreich verifiziert",
        description: "Sie können nun Ihr Passwort ändern.",
      });
      setStep('password');
    } catch (error: any) {
      console.error('OTP check error:', error);
      toast({
        variant: 'destructive',
        title: "Verifizierung fehlgeschlagen",
        description: "Der Code ist ungültig oder abgelaufen.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const onPasswordSubmit: SubmitHandler<NewPasswordFormValues> = async (data) => {
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });

      await supabase.auth.signOut();
      router.push('/login');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        variant: 'destructive',
        title: "Fehler",
        description: "Beim Aktualisieren des Passworts ist ein Fehler aufgetreten.",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm rounded-2xl border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-headline">Passwort zurücksetzen</CardTitle>
          <CardDescription>
            {step === 'otp'
              ? "Geben Sie Ihren Verifizierungscode ein."
              : "Wählen Sie ein neues sicheres Passwort."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'otp' ? (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="ihre@email.de" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verifizierungscode</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000000"
                          {...field}
                          maxLength={6}
                          className="text-center text-2xl tracking-[1em]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isVerifying}>
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Code überprüfen"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neues Passwort</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort bestätigen</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Passwort speichern"}
                </Button>
              </form>
            </Form>
          )}
          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-primary underline underline-offset-4">
              Zurück zum Login
            </Link>
          </div>
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














