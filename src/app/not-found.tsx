import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <div className="mb-8">
        <h1 className="mb-4 font-headline text-9xl font-bold text-muted-foreground">
          404
        </h1>
        <h2 className="mb-4 font-headline text-3xl font-bold md:text-4xl">
          <TranslatedText 
            fr="Page introuvable" 
            en="Page Not Found"
          >
            Seite nicht gefunden
          </TranslatedText>
        </h2>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          <TranslatedText 
            fr="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
            en="Sorry, the page you're looking for doesn't exist or has been moved."
          >
            Entschuldigung, die Seite, die Sie suchen, existiert nicht oder wurde verschoben.
          </TranslatedText>
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            <TranslatedText fr="Retour à l'accueil" en="Back to Home">
              Zur Startseite
            </TranslatedText>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/search">
            <Search className="mr-2 h-5 w-5" />
            <TranslatedText fr="Rechercher" en="Search">
              Suchen
            </TranslatedText>
          </Link>
        </Button>
      </div>
    </div>
  );
}







































