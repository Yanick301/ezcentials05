
'use client';

import { TranslatedText } from '@/components/TranslatedText';
import { Button } from '@/components/ui/button';
import { Building, Feather, Sparkles } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <p className="font-headline text-2xl text-primary">EZCENTIALS</p>
          <h1 className="mt-2 font-headline text-4xl md:text-5xl">
            <TranslatedText fr="Rejoignez Notre Maison" en="Join Our House">
              Werden Sie Teil unseres Hauses
            </TranslatedText>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            <TranslatedText
              fr="Chez EZCENTIALS, nous sommes plus qu'une marque, nous sommes une famille d'artisans, de créateurs et de passionnés unis par l'amour de l'élégance et de l'excellence. Nous sommes toujours à la recherche de talents exceptionnels pour enrichir notre histoire."
              en="At EZCENTIALS, we are more than a brand; we are a family of artisans, creators, and enthusiasts united by a love for elegance and excellence. We are always looking for exceptional talent to enrich our story."
            >
              Bei EZCENTIALS sind wir mehr als eine Marke; wir sind eine Familie von Handwerkern, Schöpfern und Enthusiasten, die durch die Liebe zur Eleganz und Exzellenz vereint sind. Wir sind immer auf der Suche nach außergewöhnlichen Talenten, um unsere Geschichte zu bereichern.
            </TranslatedText>
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">
              <TranslatedText fr="Créativité" en="Creativity">
                Kreativität
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Nous encourageons l'innovation et l'expression personnelle à tous les niveaux."
                en="We encourage innovation and personal expression at all levels."
              >
                Wir fördern Innovation und persönlichen Ausdruck auf allen Ebenen.
              </TranslatedText>
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Feather className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">
              <TranslatedText fr="Excellence" en="Excellence">
                Exzellenz
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Nous visons la perfection dans chaque détail, de la conception au service client."
                en="We aim for perfection in every detail, from design to customer service."
              >
                Wir streben nach Perfektion in jedem Detail, vom Design bis zum Kundenservice.
              </TranslatedText>
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">
              <TranslatedText fr="Héritage" en="Heritage">
                Erbe
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Nous sommes les gardiens d'un savoir-faire que nous souhaitons transmettre."
                en="We are the guardians of a craftsmanship that we wish to pass on."
              >
                Wir sind die Hüter einer Handwerkskunst, die wir weitergeben möchten.
              </TranslatedText>
            </p>
          </div>
        </div>
        
        <div className="mt-20 text-center">
            <h2 className="font-headline text-3xl">
                <TranslatedText fr="Postes Ouverts" en="Open Positions">
                    Offene Stellen
                </TranslatedText>
            </h2>
            <p className="mt-4 text-muted-foreground">
                <TranslatedText fr="Aucun poste n'est actuellement disponible, mais nous sommes toujours ouverts aux candidatures spontanées." en="No positions are currently available, but we are always open to spontaneous applications.">
                    Derzeit sind keine Stellen verfügbar, aber wir sind immer offen für Initiativbewerbungen.
                </TranslatedText>
            </p>
            <Button asChild className="mt-6" size="lg">
                <a href="mailto:careers@ezcentials.com">
                    <TranslatedText fr="Envoyer votre candidature" en="Send Your Application">
                        Ihre Bewerbung senden
                    </TranslatedText>
                </a>
            </Button>
        </div>

      </div>
    </div>
  );
}
