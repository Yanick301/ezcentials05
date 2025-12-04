
'use client';

import { TranslatedText } from '@/components/TranslatedText';
import { Award, Gem, Handshake, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="relative h-[40vh] bg-header-background bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto flex h-full items-center justify-center px-4">
          <h1 className="text-center font-headline text-5xl text-white md:text-7xl">
            <TranslatedText fr="Notre Maison" en="Our House">
              Unser Haus
            </TranslatedText>
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <p className="font-headline text-2xl text-primary">EZCENTIALS</p>
          <h2 className="mt-2 font-headline text-4xl">
            <TranslatedText
              fr="L'Art de l'Élégance Intemporelle"
              en="The Art of Timeless Elegance"
            >
              Die Kunst der zeitlosen Eleganz
            </TranslatedText>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            <TranslatedText
              fr="Fondée sur la conviction que le véritable luxe réside dans la qualité exceptionnelle et le design intemporel, EZCENTIALS est plus qu'une marque : c'est une maison de mode dédiée à la célébration de l'élégance discrète. Chaque pièce de notre collection est méticuleusement sélectionnée pour son savoir-faire, ses matériaux nobles et sa capacité à transcender les tendances éphémères."
              en="Founded on the belief that true luxury lies in exceptional quality and timeless design, EZCENTIALS is more than a brand: it is a fashion house dedicated to celebrating understated elegance. Each piece in our collection is meticulously selected for its craftsmanship, noble materials, and ability to transcend fleeting trends."
            >
              Gegründet aus der Überzeugung, dass wahrer Luxus in außergewöhnlicher Qualität und zeitlosem Design liegt, ist EZCENTIALS mehr als eine Marke: Es ist ein Modehaus, das sich der Feier der dezenten Eleganz verschrieben hat. Jedes Stück unserer Kollektion wird sorgfältig nach seiner Handwerkskunst, seinen edlen Materialien und seiner Fähigkeit, kurzlebige Trends zu überdauern, ausgewählt.
            </TranslatedText>
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              <TranslatedText fr="Notre Mission" en="Our Mission">
                Unsere Mission
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Offrir une sélection exclusive qui incarne le summum du style et de la qualité."
                en="To offer an exclusive selection that embodies the pinnacle of style and quality."
              >
                Eine exklusive Auswahl anzubieten, die den Gipfel von Stil und Qualität verkörpert.
              </TranslatedText>
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Gem className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              <TranslatedText fr="Nos Valeurs" en="Our Values">
                Unsere Werte
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Qualité, exclusivité, durabilité et un service client irréprochable."
                en="Quality, exclusivity, sustainability, and impeccable customer service."
              >
                Qualität, Exklusivität, Nachhaltigkeit und ein tadelloser Kundenservice.
              </TranslatedText>
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              <TranslatedText fr="Savoir-Faire" en="Craftsmanship">
                Handwerkskunst
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Nous collaborons avec les meilleurs artisans pour garantir des finitions parfaites."
                en="We collaborate with the best artisans to ensure perfect finishes."
              >
                Wir arbeiten mit den besten Handwerkern zusammen, um perfekte Oberflächen zu gewährleisten.
              </TranslatedText>
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Handshake className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              <TranslatedText fr="Notre Engagement" en="Our Commitment">
                Unser Engagement
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Construire une relation de confiance durable avec chacun de nos clients."
                en="To build a lasting relationship of trust with each of our clients."
              >
                Eine dauerhafte Vertrauensbeziehung zu jedem unserer Kunden aufzubauen.
              </TranslatedText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
