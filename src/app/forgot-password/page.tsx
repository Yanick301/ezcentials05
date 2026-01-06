
'use client';

import { useRouter } from 'next/navigation';
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

export default function ForgotPasswordPage() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();

  const currentSchema = forgotPasswordSchemaDE;

  const form = useForm<z.infer<typeof currentSchema>>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof currentSchema>> = async (data) => {
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);

      if (error) throw error;

      toast({
        title: "Code gesendet",
        description: "Überprüfen Sie Ihren Posteingang für den Verifizierungscode.",
      });

      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten.",
      });
    }
  };


  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Passwort vergessen
          </CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Code zum Zurücksetzen Ihres Passworts.
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ihre@email.de" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Senden..." : "Verifizierungscode senden"}
              </Button>
            </form>
          </Form>
          <Button variant="ghost" asChild className="mt-4 w-full">
            <Link href="/login">Zurück zum Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
