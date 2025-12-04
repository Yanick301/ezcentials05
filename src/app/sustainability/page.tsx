
'use client';

import { TranslatedText } from '@/components/TranslatedText';
import { Leaf, Recycle, Award } from 'lucide-react';

export default function SustainabilityPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <p className="font-headline text-2xl text-primary">EZCENTIALS</p>
          <h1 className="mt-2 font-headline text-4xl md:text-5xl">
            <TranslatedText fr="Notre Engagement Durable" en="Our Sustainable Commitment">
              Unser nachhaltiges Engagement
            </TranslatedText>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            <TranslatedText
              fr="Le véritable luxe est celui qui dure. Chez EZCENTIALS, nous croyons qu'un vêtement exceptionnel doit l'être pour vous et pour la planète. Notre démarche de durabilité est ancrée dans chaque fibre de nos créations, de la sélection des matières premières à la confection artisanale."
              en="True luxury is that which lasts. At EZCENTIALS, we believe that an exceptional garment must be so for you and for the planet. Our approach to sustainability is rooted in every fiber of our creations, from the selection of raw materials to artisanal craftsmanship."
            >
              Wahrer Luxus ist der, der von Dauer ist. Bei EZCENTIALS glauben wir, dass ein außergewöhnliches Kleidungsstück für Sie und für den Planeten außergewöhnlich sein muss. Unser Nachhaltigkeitsansatz ist in jeder Faser unserer Kreationen verankert, von der Auswahl der Rohstoffe bis zur handwerklichen Fertigung.
            </TranslatedText>
          </p>
        </div>

        <div className="mt-20 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Leaf className="h-6 w-6" />
                        </div>
                        <h3 className="font-headline text-2xl">
                          <TranslatedText fr="Matières Nobles et Responsables" en="Noble and Responsible Materials">
                            Edle und verantwortungsvolle Materialien
                          </TranslatedText>
                        </h3>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                        <TranslatedText
                          fr="Nous privilégions les fibres naturelles, biologiques ou recyclées. Chaque tissu est choisi pour son faible impact environnemental et sa qualité exceptionnelle, garantissant la beauté et la longévité de nos pièces."
                          en="We prioritize natural, organic, or recycled fibers. Each fabric is chosen for its low environmental impact and exceptional quality, ensuring the beauty and longevity of our pieces."
                        >
                          Wir bevorzugen natürliche, biologische oder recycelte Fasern. Jeder Stoff wird aufgrund seiner geringen Umweltauswirkungen und seiner außergewöhnlichen Qualität ausgewählt, um die Schönheit und Langlebigkeit unserer Stücke zu gewährleisten.
                        </TranslatedText>
                    </p>
                </div>
                <div className="rounded-lg overflow-hidden aspect-video">
                    <img src="/images/products/Femme.jpg" alt="Fabric close-up" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-lg overflow-hidden aspect-video md:order-2">
                    <img src="/images/products/Homme.jpg" alt="Artisan at work" className="w-full h-full object-cover" />
                </div>
                <div className="md:order-1">
                    <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Award className="h-6 w-6" />
                        </div>
                        <h3 className="font-headline text-2xl">
                          <TranslatedText fr="Savoir-Faire Artisanal" en="Artisanal Craftsmanship">
                            Handwerkliches Können
                          </TranslatedText>
                        </h3>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                        <TranslatedText
                          fr="Nous collaborons avec des ateliers qui partagent nos valeurs. En favorisant une production locale et à échelle humaine, nous préservons des savoir-faire d'exception et garantissons des conditions de travail justes."
                          en="We collaborate with workshops that share our values. By promoting local, human-scale production, we preserve exceptional craftsmanship and ensure fair working conditions."
                        >
                          Wir arbeiten mit Werkstätten zusammen, die unsere Werte teilen. Indem wir eine lokale und menschliche Produktion fördern, bewahren wir außergewöhnliches handwerkliches Können und gewährleisten faire Arbeitsbedingungen.
                        </TranslatedText>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Recycle className="h-6 w-6" />
                        </div>
                        <h3 className="font-headline text-2xl">
                          <TranslatedText fr="Une Mode Pensée pour Durer" en="Fashion Designed to Last">
                            Mode, die für die Ewigkeit gemacht ist
                          </TranslatedText>
                        </h3>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                        <TranslatedText
                          fr="Au-delà des tendances, nous créons des pièces intemporelles. Notre service de réparation et nos conseils d'entretien sont là pour vous aider à chérir vos vêtements saison après saison, réduisant ainsi le gaspillage."
                          en="Beyond trends, we create timeless pieces. Our repair service and care tips are here to help you cherish your clothes season after season, thus reducing waste."
                        >
                          Über Trends hinaus schaffen wir zeitlose Stücke. Unser Reparaturservice und unsere Pflegetipps helfen Ihnen, Ihre Kleidung Saison für Saison zu schätzen und so Abfall zu reduzieren.
                        </TranslatedText>
                    </p>
                </div>
                <div className="rounded-lg overflow-hidden aspect-video">
                    <img src="/images/products/acc.jpg" alt="Timeless design pieces" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
