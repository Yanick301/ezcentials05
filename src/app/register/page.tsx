
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import RegisterPageClient from './RegisterPageClient';
import { TranslatedText } from '@/components/TranslatedText';

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex h-[60vh] items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4"><TranslatedText fr="Chargement de la page d'inscription..." en="Loading registration page...">Lade Registrierungsseite...</TranslatedText></p>
      </div>
    }>
      <RegisterPageClient />
    </Suspense>
  );
}
