/**
 * Prix par volume pour les parfums
 * Chaque prix inclut déjà les +15€ ajoutés
 */

export const perfumePrices: Record<string, Record<string, number>> = {
  // PARFUMS HOMME
  'bleu-de-chanel': {
    '50ml': 125,  // 110 + 15
    '100ml': 155, // 140 + 15
    '150ml': 195, // 180 + 15
  },
  'dior-sauvage': {
    '30ml': 75,   // 60 + 15
    '60ml': 95,   // 80 + 15
    '100ml': 125, // 110 + 15
  },
  'acqua-di-gio': {
    '50ml': 85,   // 70 + 15
    '100ml': 105, // 90 + 15
  },
  'ysl-lhomme': {
    '40ml': 70,   // 55 + 15
    '100ml': 100, // 85 + 15
  },
  'terre-dhermes': {
    '50ml': 90,   // 75 + 15
    '100ml': 120, // 105 + 15
  },
  'one-million': {
    '50ml': 73,   // 58 + 15
    '100ml': 95,  // 80 + 15
  },
  'le-male': {
    '40ml': 60,   // 45 + 15
    '75ml': 80,   // 65 + 15
  },
  'azzaro-wanted': {
    '50ml': 70,   // 55 + 15
    '100ml': 90,  // 75 + 15
  },
  'boss-bottled-beyond': {
    '50ml': 75,   // 60 + 15
    '100ml': 100, // 85 + 15
  },
  'montblanc-legend-red': {
    '50ml': 65,   // 50 + 15
    '100ml': 85,  // 70 + 15
  },
  'ysl-la-nuit': {
    '40ml': 75,   // 60 + 15
    '100ml': 105, // 90 + 15
  },
  'versace-eros': {
    '50ml': 80,   // 65 + 15
    '100ml': 105, // 90 + 15
  },
  'habit-rouge': {
    '50ml': 85,   // 70 + 15
    '100ml': 105, // 90 + 15
  },
  'prada-paradigme': {
    '50ml': 90,   // 75 + 15
    '100ml': 115, // 100 + 15
  },
  'issey-le-sel': {
    '50ml': 80,   // 65 + 15
    '100ml': 100, // 85 + 15
  },
  // PARFUMS FEMME
  'dior-jadore': {
    '50ml': 95,   // 80 + 15
    '100ml': 125, // 110 + 15
    '150ml': 155, // 140 + 15
  },
  'lancome-la-vie-est-belle': {
    '30ml': 95,   // 80 + 15
    '50ml': 110,  // 95 + 15
    '75ml': 100,  // 85 + 15
    '100ml': 110, // 95 + 15
    '150ml': 155, // 140 + 15
  },
  'chanel-coco-mademoiselle': {
    '50ml': 105,  // 90 + 15
    '100ml': 135, // 120 + 15
  },
  'ysl-black-opium': {
    '50ml': 100,  // 85 + 15
    '90ml': 125,  // 110 + 15
  },
  'miss-dior': {
    '30ml': 78,   // 63 + 15
    '50ml': 104,  // 89 + 15
    '100ml': 123, // 108 + 15
  },
  'gucci-bamboo': {
    '50ml': 85,   // 70 + 15
    '100ml': 110, // 95 + 15
  },
  'good-girl': {
    '50ml': 83,   // 68 + 15
    '80ml': 108,  // 93 + 15
  },
  'la-bomba': {
    '50ml': 85,   // 70 + 15
    '80ml': 110,  // 95 + 15
  },
  'lancome-tresor': {
    '50ml': 95,   // 80 + 15
    '100ml': 120, // 105 + 15
  },
  'chanel-no5': {
    '50ml': 100,  // 85 + 15
    '100ml': 135, // 120 + 15
  },
  'prada-paradoxe': {
    '30ml': 80,   // 65 + 15
    '50ml': 95,   // 80 + 15
  },
  'tom-ford-cafe-rose': {
    '50ml': 165,  // 150 + 15
    '100ml': 215, // 200 + 15
  },
  'dior-addict': {
    '50ml': 100,  // 85 + 15
    '100ml': 130, // 115 + 15
  },
  'gucci-bloom': {
    '50ml': 90,   // 75 + 15
    '100ml': 120, // 105 + 15
  },
  'dolce-gabbana-the-one': {
    '50ml': 100,  // 85 + 15
    '100ml': 135, // 120 + 15
  },
  // NOUVEAUX PARFUMS LUXE
  'creed-aventus': {
    '30ml': 155,
    '50ml': 180,
    '100ml': 265,
    '240ml': 495,
  },
  'baccarat-rouge-540-extrait': {
    '70ml': 365,
    '200ml': 715,
  },
  'initio-oud-for-greatness': {
    '50ml': 252,
    '90ml': 425,
  },
  'tom-ford-oud-wood': {
    '50ml': 400,
    '100ml': 600,
  },
  'parfums-de-marly-herod': {
    '75ml': 385,
    '125ml': 490,
  },
  'by-kilian-black-phantom': {
    '50ml': 390,
    '100ml': 690,
  },
  'amouage-interlude-man': {
    '50ml': 300,
    '100ml': 385,
  },
  'creed-love-in-white': {
    '100ml': 390,
    '250ml': 890,
  },
  'mfk-oud-satin-mood': {
    '70ml': 395,
    '200ml': 810,
  },
  'xerjoff-naxos': {
    '50ml': 340,
    '100ml': 425,
  },
  'roja-enigma-pour-homme': {
    '50ml': 395,
    '100ml': 595,
  },
  'frederic-malle-portrait-of-a-lady': {
    '100ml': 425,
  },
  'serge-lutens-borneo-1834': {
    '100ml': 395,
  },
  'parfums-de-marly-delina-exclusif': {
    '75ml': 410,
    '125ml': 590,
  },
  'amouage-jubilation-xxv': {
    '100ml': 450,
  },
};

/**
 * Récupère le prix d'un parfum selon le volume sélectionné
 */
export function getPerfumePrice(productSlug: string, volume: string): number | null {
  const prices = perfumePrices[productSlug];
  if (!prices) return null;
  return prices[volume] || null;
}

/**
 * Récupère le prix d'un produit (parfum ou autre)
 * Si c'est un parfum avec un volume sélectionné, retourne le prix du volume
 * Sinon, retourne le prix de base du produit
 */
export function getProductPrice(product: { slug: string; price: number; category: string }, selectedSize?: string): number {
  if (product.category === 'perfume' && selectedSize) {
    const perfumePrice = getPerfumePrice(product.slug, selectedSize);
    if (perfumePrice !== null) {
      return perfumePrice;
    }
  }
  return product.price;
}




