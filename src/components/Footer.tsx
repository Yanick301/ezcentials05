
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { TranslatedText } from './TranslatedText';
import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const footerSections = [
    {
      title: 'Hilfe',
      title_fr: 'Aide',
      title_en: 'Help',
      links: [
        { name: 'Kontaktieren Sie uns', name_fr: 'Contactez-nous', name_en: 'Contact Us', href: 'mailto:contact-support@ezcentials.com', isExternal: true },
        { name: 'FAQs', name_fr: 'FAQs', name_en: 'FAQs', href: '/faq' },
        { name: 'Produktpflege', name_fr: 'Entretien des produits', name_en: 'Product Care', href: '/product-care' },
        { name: 'Rechtliche Hinweise', name_fr: 'Mentions légales', name_en: 'Legal Notice', href: '/legal-notice' },
      ],
    },
    {
      title: 'Dienstleistungen',
      title_fr: 'Services',
      title_en: 'Services',
      links: [
        { name: 'Reparaturen', name_fr: 'Réparations', name_en: 'Repairs', href: '/repairs' },
        { name: 'Personalisierung', name_fr: 'Personnalisation', name_en: 'Personalization', href: '/products/all' },
        { name: 'Geschenkkarten', name_fr: 'Cartes cadeaux', name_en: 'Gift Cards', href: '/products/all' },
      ],
    },
    {
      title: 'Über EZCENTIALS',
      title_fr: 'À propos d\'EZCENTIALS',
      title_en: 'About EZCENTIALS',
      links: [
        { name: 'Modehäuser', name_fr: 'Notre Maison', name_en: 'Our House', href: '/about' },
        { name: 'Nachhaltigkeit', name_fr: 'Durabilité', name_en: 'Sustainability', href: '/sustainability' },
        { name: 'Karriere', name_fr: 'Carrières', name_en: 'Careers', href: '/careers' },
      ],
    },
  ];
  
  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/ezcentials_?igsh=MTU5M3ZwN3Fhdjl2bA==', image: '/images/insta.png' },
    { name: 'Snapchat', href: 'https://snapchat.com/t/qez0Z1z0', image: '/images/snap.png' },
    { name: 'YouTube', href: 'https://www.youtube.com/@Ezcentials', image: '/images/youtub.jpg' },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61584544420068', image: '/images/fb.png' },
  ];

  return (
    <footer className="border-t border-stone-800 bg-footer text-stone-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="col-span-1 mb-8 lg:col-span-1 lg:mb-0">
                <h5 className="font-headline text-xl font-semibold tracking-wider text-white">EZCENTIALS</h5>
            </div>
            <div className="col-span-1 grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-4 lg:grid-cols-4">
                {footerSections.map((section) => (
                <div key={section.title}>
                    <h5 className="font-headline text-lg font-semibold tracking-wider text-white">
                    <TranslatedText fr={section.title_fr} en={section.title_en}>{section.title}</TranslatedText>
                    </h5>
                    <ul className="mt-4 space-y-3">
                    {section.links.map((link) => (
                        <li key={link.name}>
                          <Link href={link.href} target={link.isExternal ? '_blank' : undefined} rel={link.isExternal ? 'noopener noreferrer' : undefined} className="text-sm text-stone-300 hover:text-white flex items-center gap-2">
                            <TranslatedText fr={link.name_fr} en={link.name_en}>{link.name}</TranslatedText>
                          </Link>
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
                 <div>
                    <h5 className="font-headline text-lg font-semibold tracking-wider text-white">
                        <TranslatedText fr="Réseaux sociaux" en="Social Media">Soziale Medien</TranslatedText>
                    </h5>
                    <ul className="mt-4 flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <li key={link.name}>
                                <a href={link.href} target="_blank" rel="noopener noreferrer" className="block text-sm text-stone-300 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                    <Image src={link.image} alt={`${link.name} logo`} width={28} height={28} className="h-7 w-7" loading="lazy" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-center gap-2 border-t border-stone-800 pt-8 text-center text-sm text-stone-400">
           <div className="flex items-center gap-2">
                <p>&copy; {currentYear} <TranslatedText fr="EZCENTIALS. Tous droits réservés." en="EZCENTIALS. All rights reserved.">EZCENTIALS. Alle Rechte vorbehalten.</TranslatedText></p>
           </div>
        </div>
      </div>
    </footer>
  );
}
