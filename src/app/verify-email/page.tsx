
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
import { MailCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';

const otpSchemaDE = z.object({
  otp: z.string().length(6, { message: 'Der Code muss genau 6 Ziffern lang sein.' }),
});

type OtpFormValues = z.infer<typeof otpSchemaDE>;

function VerifyEmailForm() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const email = searchParams.get('email') || '';

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchemaDE),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: data.otp,
        type: 'signup',
      });

      if (error) throw error;

      toast({
        title: "Konto bestätigt!",
        description: "Ihre E-Mail wurde erfolgreich verifiziert.",
      });

      router.push('/account');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        variant: 'destructive',
        title: "Verifizierung fehlgeschlagen",
        description: "Der eingegebene Code ist ungültig oder abgelaufen.",
      });
    }
  };

  const handleResend = async () => {
    if (!supabase || !email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "Code erneut gesendet",
        description: "Ein neuer Verifizierungscode wurde an Ihre E-Mail gesendet.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        variant: 'destructive',
        title: "Fehler",
        description: "Beim Senden des Codes ist un Fehler aufgetreten.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm rounded-2xl border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-headline">Bestätigung</CardTitle>
          <CardDescription>
            Geben Sie den 6-stelligen Code ein, den wir an <span className="font-semibold">{email}</span> gesendet haben.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verifizierungscode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000"
                        {...field}
                        className="text-center text-2xl tracking-[1em]"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird überprüft...
                    </>
                  ) : (
                    "Konto verifizieren"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  Code erneut senden
                </Button>
              </div>
            </form>
          </Form>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
