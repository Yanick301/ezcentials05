
'use client';

import { TranslatedText } from '@/components/TranslatedText';
import { Button } from '@/components/ui/button';
import { Wrench, Package, Mail } from 'lucide-react';

export default function RepairsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <p className="font-headline text-2xl text-primary">EZCENTIALS</p>
          <h1 className="mt-2 font-headline text-4xl md:text-5xl">
            <TranslatedText fr="Service de Réparations" en="Repair Service">
              Reparaturservice
            </TranslatedText>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            <TranslatedText
              fr="Une pièce EZCENTIALS est un investissement pour la vie. Nous nous engageons à préserver la beauté et la fonctionnalité de vos articles au fil du temps. Notre service de réparation est à votre disposition pour redonner vie à vos pièces les plus précieuses."
              en="An EZCENTIALS piece is a lifetime investment. We are committed to preserving the beauty and functionality of your items over time. Our repair service is at your disposal to give new life to your most precious pieces."
            >
              Ein Stück von EZCENTIALS ist eine Investition fürs Leben. Wir verpflichten uns, die Schönheit und Funktionalität Ihrer Artikel im Laufe der Zeit zu bewahren. Unser Reparaturservice steht Ihnen zur Verfügung, um Ihren wertvollsten Stücken neues Leben einzuhauchen.
            </TranslatedText>
          </p>
        </div>

        <div className="mt-20 space-y-8">
            <h2 className="text-center font-headline text-3xl">
                <TranslatedText fr="Comment ça marche ?" en="How it Works?">
                    Wie es funktioniert
                </TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="border p-8 rounded-lg">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">1. <TranslatedText fr="Contactez-nous" en="Contact Us">Kontaktieren Sie uns</TranslatedText></h3>
                    <p className="mt-2 text-muted-foreground">
                        <TranslatedText
                          fr="Envoyez-nous un email décrivant le problème avec des photos de l'article."
                          en="Send us an email describing the issue with photos of the item."
                        >
                          Senden Sie uns eine E-Mail mit einer Beschreibung des Problems und Fotos des Artikels.
                        </TranslatedText>
                    </p>
                </div>
                <div className="border p-8 rounded-lg">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Package className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">2. <TranslatedText fr="Envoyez votre article" en="Send Your Item">Senden Sie Ihren Artikel</TranslatedText></h3>
                    <p className="mt-2 text-muted-foreground">
                        <TranslatedText
                          fr="Après évaluation, nous vous fournirons les instructions pour nous envoyer votre pièce en toute sécurité."
                          en="After evaluation, we will provide you with instructions to send us your piece securely."
                        >
                          Nach der Bewertung erhalten Sie von uns Anweisungen, wie Sie Ihr Stück sicher an uns senden können.
                        </TranslatedText>
                    </p>
                </div>
                <div className="border p-8 rounded-lg">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Wrench className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">3. <TranslatedText fr="Réparation" en="Repair">Reparatur</TranslatedText></h3>
                    <p className="mt-2 text-muted-foreground">
                        <TranslatedText
                          fr="Nos artisans experts prendront soin de votre article pour lui redonner son éclat d'origine."
                          en="Our expert artisans will take care of your item to restore its original splendor."
                        >
                          Unsere erfahrenen Handwerker kümmern sich um Ihren Artikel, um ihm seinen ursprünglichen Glanz zurückzugeben.
                        </TranslatedText>
                    </p>
                </div>
            </div>
        </div>
        
        <div className="mt-20 text-center">
            <h2 className="font-headline text-3xl">
                <TranslatedText fr="Prêt à commencer ?" en="Ready to Start?">
                    Bereit anzufangen?
                </TranslatedText>
            </h2>
            <p className="mt-4 text-muted-foreground">
                <TranslatedText fr="Contactez notre service client pour initier une demande de réparation." en="Contact our customer service to initiate a repair request.">
                    Kontaktieren Sie unseren Kundenservice, um eine Reparaturanfrage zu stellen.
                </TranslatedText>
            </p>
            <Button asChild className="mt-6" size="lg">
                <a href="mailto:repairs@ezcentials.com">
                    <TranslatedText fr="Contacter le Service Réparation" en="Contact Repair Service">
                        Reparaturservice kontaktieren
                    </TranslatedText>
                </a>
            </Button>
        </div>

      </div>
    </div>
  );
}
