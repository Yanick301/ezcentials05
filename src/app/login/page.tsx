
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LoginPageClient from './LoginPageClient';
import { TranslatedText } from '@/components/TranslatedText';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex h-[60vh] items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4"><TranslatedText fr="Chargement de la page de connexion..." en="Loading login page...">Lade Anmeldeseite...</TranslatedText></p>
      </div>
    }>
      <LoginPageClient />
    </Suspense>
  );
}
