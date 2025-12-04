
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TranslatedText } from '@/components/TranslatedText';
import { Mail, Phone, ShoppingCart, Truck, Undo } from 'lucide-react';

export default function FaqPage() {
  const faqs = [
    {
      icon: <ShoppingCart className="mr-3 h-5 w-5 text-primary" />,
      question_de: 'Wie gebe ich eine Bestellung auf?',
      question_fr: 'Comment passer une commande ?',
      question_en: 'How do I place an order?',
      answer_de:
        'Wählen Sie Artikel aus und legen Sie sie in den Warenkorb. Gehen Sie zur Kasse, geben Sie Ihre Lieferinformationen an und folgen Sie den Anweisungen, um einen sofortigen Banktransfer durchzuführen. Laden Sie Ihren Zahlungsbeleg hoch. Ihre Bestellung wird nach Überprüfung des Belegs validiert.',
      answer_fr:
        'Sélectionnez des articles et ajoutez-les au panier. Passez à la caisse, fournissez vos informations de livraison, puis suivez les instructions pour effectuer un virement bancaire instantané. Téléversez votre reçu de paiement. Votre commande sera validée après vérification du reçu.',
      answer_en:
        'Select items and add them to the cart. Proceed to checkout, provide your shipping information, then follow the instructions to make an instant bank transfer. Upload your payment receipt. Your order will be validated after receipt verification.',
    },
    {
      icon: <Truck className="mr-3 h-5 w-5 text-primary" />,
      question_de: 'Was sind die Lieferzeiten?',
      question_fr: 'Quels sont les délais de livraison ?',
      question_en: 'What are the delivery times?',
      answer_de:
        'Sobald Ihre Zahlung validiert ist, wird Ihre Bestellung innerhalb von 1-2 Werktagen vorbereitet. Die Standardlieferung dauert dann in der Regel 3-5 Werktage für Deutschland und 5-10 Werktage für internationale Sendungen. Wir tun unser Bestes, um Ihre luxuriösen Stücke so schnell wie möglich zu liefern.',
      answer_fr:
        'Une fois votre paiement validé, votre commande est préparée sous 1 à 2 jours ouvrés. La livraison standard prend ensuite généralement 3 à 5 jours ouvrés pour l\'Allemagne et 5 à 10 jours pour l\'international. Nous faisons notre maximum pour vous livrer vos pièces de luxe au plus vite.',
      answer_en:
        'Once your payment is validated, your order is prepared within 1-2 business days. Standard delivery then usually takes 3-5 business days for Germany and 5-10 business days for international shipments. We do our best to deliver your luxury pieces as quickly as possible.',
    },
    {
      icon: <Undo className="mr-3 h-5 w-5 text-primary" />,
      question_de: 'Wie kann ich einen Artikel zurückgeben?',
      question_fr: 'Comment puis-je retourner un article ?',
      question_en: 'How can I return an item?',
      answer_de:
        'Wir akzeptieren Rücksendungen innerhalb von 14 Tagen nach Erhalt Ihrer Bestellung. Die Artikel müssen ungetragen, unbenutzt und in ihrer Originalverpackung mit allen Etiketten zurückgesendet werden. Um eine Rücksendung zu veranlassen, kontaktieren Sie bitte unseren Kundenservice unter contact-support@ezcentials.com, um die Anweisungen zu erhalten.',
      answer_fr:
        'Nous acceptons les retours dans les 14 jours suivant la réception de votre commande. Les articles doivent être retournés non portés, non utilisés, et dans leur emballage d\'origine avec toutes les étiquettes. Pour initier un retour, veuillez contacter notre service client à contact-support@ezcentials.com afin d\'obtenir la procédure à suivre.',
      answer_en:
        'We accept returns within 14 days of receiving your order. Items must be returned unworn, unused, and in their original packaging with all tags attached. To initiate a return, please contact our customer service at contact-support@ezcentials.com to receive instructions.',
    },
     {
      icon: <Mail className="mr-3 h-5 w-5 text-primary" />,
      question_de: 'Wie kann ich den Kundenservice kontaktieren?',
      question_fr: 'Comment contacter le service client ?',
      question_en: 'How do I contact customer service?',
      answer_de:
        'Unser Kundenservice steht Ihnen zur Verfügung, um alle Ihre Fragen zu beantworten. Sie können uns per E-Mail unter contact-support@ezcentials.com erreichen. Wir sind von Montag bis Freitag von 9 bis 18 Uhr erreichbar.',
      answer_fr:
        'Notre service client est à votre disposition pour répondre à toutes vos questions. Vous pouvez nous contacter par email à l\'adresse contact-support@ezcentials.com. Nous sommes disponibles du lundi au vendredi, de 9h à 18h.',
      answer_en:
        'Our customer service is available to answer all your questions. You can contact us by email at contact-support@ezcentials.com. We are available Monday to Friday, from 9am to 6pm.',
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl">
          <TranslatedText fr="Questions Fréquentes" en="Frequently Asked Questions">
            Häufig gestellte Fragen
          </TranslatedText>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <TranslatedText
            fr="Trouvez ici les réponses à vos questions."
            en="Find answers to your questions here."
          >
            Finden Sie hier Antworten auf Ihre Fragen.
          </TranslatedText>
        </p>
      </div>

      <Accordion type="single" collapsible className="mt-12 w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
              <div className='flex items-center'>
                 {faq.icon}
                <TranslatedText fr={faq.question_fr} en={faq.question_en}>
                  {faq.question_de}
                </TranslatedText>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-base text-muted-foreground">
              <TranslatedText fr={faq.answer_fr} en={faq.answer_en}>
                {faq.answer_de}
              </TranslatedText>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
