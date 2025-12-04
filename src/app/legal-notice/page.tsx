
'use client';

import { TranslatedText } from '@/components/TranslatedText';

export default function LegalNoticePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl">
          <TranslatedText fr="Mentions Légales" en="Legal Notice">
            Impressum
          </TranslatedText>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          <TranslatedText
            fr="Informations concernant l'éditeur du site."
            en="Information concerning the site publisher."
          >
            Angaben gemäß § 5 TMG.
          </TranslatedText>
        </p>
      </div>

      <div className="prose prose-lg mx-auto mt-12 max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground">
        <h2 className='text-2xl'>
          <TranslatedText fr="Éditeur du Site" en="Site Publisher">
            Anbieter
          </TranslatedText>
        </h2>
        <p>
          EZCENTIALS GmbH
          <br />
          Adresse : Kurfürstendamm 21, 10719 Berlin, Deutschland
          <br />
          Email : contact-support@ezcentials.com
          <br />
          USt-IdNr.: DE123456789
          <br />
           <TranslatedText fr="Directeur de la publication :" en="Director of Publication:">
             Geschäftsführer:
           </TranslatedText>{' '}
           LABINSKY sandro
        </p>

        <h2 className='text-2xl'>
          <TranslatedText fr="Propriété Intellectuelle" en="Intellectual Property">
            Geistiges Eigentum
          </TranslatedText>
        </h2>
        <p>
          <TranslatedText
            fr="L'ensemble de ce site relève de la législation allemande sur le droit d'auteur et la propriété intellectuelle. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication."
            en="This entire site is subject to German copyright and intellectual property law. The reproduction of all or part of this site on any electronic medium whatsoever is formally prohibited without the express authorization of the director of publication."
          >
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </TranslatedText>
        </p>
        
        <h2 className='text-2xl'>
          <TranslatedText fr="Données Personnelles" en="Personal Data">
            Datenschutz
          </TranslatedText>
        </h2>
        <p>
          <TranslatedText fr="Conformément à la loi 'Informatique et Libertés', vous disposez d'un droit d'accès, de modification, de rectification et de suppression des données qui vous concernent. Pour l'exercer, adressez-vous à EZCENTIALS par email à l'adresse contact-privacy@ezcentials.com." 
          en="In accordance with the 'Informatique et Libertés' law, you have the right to access, modify, rectify and delete data concerning you. To exercise this right, please contact EZCENTIALS by email at contact-privacy@ezcentials.com."
          >
            Informationen zum Umgang mit personenbezogenen Daten finden Sie in unserer Datenschutzerklärung. Bei Fragen zum Datenschutz können Sie uns unter contact-privacy@ezcentials.com erreichen.
          </TranslatedText>
        </p>
      </div>
    </div>
  );
}
