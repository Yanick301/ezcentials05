
'use client';

import { TranslatedText } from '@/components/TranslatedText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ProductCarePage() {
    const careGuides = [
        {
            title_de: "Kaschmir & Wolle",
            title_fr: "Cachemire & Laine",
            title_en: "Cashmere & Wool",
            content_de: "Handwäsche in kaltem Wasser mit einem speziellen Wollwaschmittel. Nicht auswringen. Flach im Schatten trocknen. Bei niedriger Temperatur mit einem feuchten Tuch bügeln. Falten Sie Ihre Strickwaren, anstatt sie aufzuhängen, um Verformungen zu vermeiden.",
            content_fr: "Lavage à la main à l'eau froide avec une lessive spéciale laine. Ne pas tordre. Sécher à plat à l'ombre. Repasser à basse température avec un linge humide. Pliez vos mailles plutôt que de les suspendre pour éviter qu'elles ne se déforment.",
            content_en: "Hand wash in cold water with a special wool detergent. Do not wring. Dry flat in the shade. Iron at low temperature with a damp cloth. Fold your knits rather than hanging them to prevent distortion."
        },
        {
            title_de: "Seide",
            title_fr: "Soie",
            title_en: "Silk",
            content_de: "Bevorzugen Sie die chemische Reinigung. Für eine Handwäsche kaltes Wasser und ein spezielles Seidenwaschmittel verwenden. Nicht einweichen lassen. Vorsichtig ausspülen und auf einem gepolsterten Bügel im Schatten trocknen lassen. Von innen bei sehr niedriger Temperatur bügeln.",
            content_fr: "Privilégiez le nettoyage à sec. Pour un lavage à la main, utilisez de l'eau froide et une lessive pour soie. Ne laissez pas tremper. Rincez délicatement et laissez sécher sur un cintre rembourré, à l'abri du soleil. Repassez sur l'envers à très basse température.",
            content_en: "Prefer dry cleaning. For hand washing, use cold water and a silk detergent. Do not soak. Rinse gently and let dry on a padded hanger away from the sun. Iron on the reverse side at a very low temperature."
        },
        {
            title_de: "Leder",
            title_fr: "Cuir",
            title_en: "Leather",
            content_de: "Regelmäßig mit einer speziellen Ledermilch nähren. Flecken mit einem leicht feuchten Tuch und Marseille-Seife entfernen. Niemals direktem Sonnenlicht oder einer Wärmequelle aussetzen. Bei größeren Schäden einen Fachmann konsultieren.",
            content_fr: "Nourrissez régulièrement avec un lait spécial cuir. Imperméabilisez votre pièce avant la première utilisation. En cas de tache, utilisez un chiffon légèrement humide avec du savon de Marseille. Ne jamais exposer à la lumière directe du soleil ou à une source de chaleur.",
            content_en: "Nourish regularly with a special leather milk. Waterproof your piece before first use. In case of a stain, use a slightly damp cloth with Marseille soap. Never expose to direct sunlight or a heat source."
        },
        {
            title_de: "Denim",
            title_fr: "Denim",
            title_en: "Denim",
            content_de: "Auf links bei niedriger Temperatur waschen, um die Farbe zu erhalten. Selten waschen, um eine natürliche Patina zu entwickeln. Zum Trocknen aufhängen. Vermeiden Sie den Trockner, der die Fasern beschädigen kann.",
            content_fr: "Lavez sur l'envers et à basse température pour préserver la couleur. Lavez peu fréquemment pour développer une patine naturelle. Suspendre pour sécher. Évitez le sèche-linge qui peut endommager les fibres.",
            content_en: "Wash inside out and at low temperature to preserve the color. Wash infrequently to develop a natural patina. Hang to dry. Avoid the dryer which can damage the fibers."
        }
    ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl">
          <TranslatedText fr="Entretien des Produits" en="Product Care">
            Produktpflege
          </TranslatedText>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <TranslatedText
            fr="Préservez la beauté de vos pièces EZCENTIALS avec nos conseils d'experts."
            en="Preserve the beauty of your EZCENTIALS pieces with our expert advice."
          >
            Bewahren Sie die Schönheit Ihrer EZCENTIALS-Stücke mit unseren Expertentipps.
          </TranslatedText>
        </p>
      </div>

      <Accordion type="single" collapsible className="mt-12 w-full">
        {careGuides.map((guide, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
              <TranslatedText fr={guide.title_fr} en={guide.title_en}>
                {guide.title_de}
              </TranslatedText>
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base text-muted-foreground leading-relaxed">
               <TranslatedText fr={guide.content_fr} en={guide.content_en}>
                {guide.content_de}
              </TranslatedText>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
