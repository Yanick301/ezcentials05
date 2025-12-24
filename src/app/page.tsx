
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getTrendingProducts, products, getProductsByCategory, getWinterSaleProducts } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { TranslatedText } from '@/components/TranslatedText';
import { CategoryCard } from '@/components/CategoryCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { CollectionHighlight } from '@/components/CollectionHighlight';
import { categories } from '@/lib/data';
import { Award, Leaf, Star, Truck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';

export default function HomePage() {
  // We want 9 products in total on the homepage sale section - memoize to avoid recalculation
  const trendingProducts = useMemo(() => getTrendingProducts(products).slice(0, 9), []);
  
  // Get 5 products from each category on sale (with oldPrice) for end of year promotions
  // Garmin watches first, then other categories
  const endOfYearPromoProducts = useMemo(() => {
    const categories = ['garmin-watch', 'mens-clothing', 'womens-clothing', 'accessories', 'shoes', 'sport', 'winter-clothing', 'perfume'];
    const promoByCategory: { [key: string]: typeof products } = {};
    
    categories.forEach(category => {
      const categoryProducts = getProductsByCategory(products, category);
      const promoProducts = categoryProducts.filter(p => p.oldPrice).slice(0, 5);
      if (promoProducts.length > 0) {
        promoByCategory[category] = promoProducts;
      }
    });
    
    return promoByCategory;
  }, []);
  
  const testimonials = useMemo(() => [
    {
      name: 'Sophie L.',
      image: '/images/products/femme1.jpg',
      rating: 5,
      title_de: 'Absolut begeistert!',
      title_fr: 'Absolument ravie !',
      title_en: 'Absolutely delighted!',
      text_de: 'Die Qualität des Wollmantels ist außergewöhnlich. Man spürt das Know-how. Die Lieferung erfolgte innerhalb von 48 Stunden. Ich werde wieder bestellen!',
      text_fr: 'La qualité du manteau en laine est exceptionnelle. On sent le savoir-faire. La livraison a été effectuée en moins de 48h. Je recommanderai !',
      text_en: 'The quality of the wool coat is exceptional. You can feel the craftsmanship. Delivery was made in less than 48 hours. I will order again!',
    },
    {
      name: 'Julien D.',
      image: '/images/products/costume-2-pieces-zegna.jpg',
      rating: 5,
      title_de: 'Tadelloser Service',
      title_fr: 'Service impeccable',
      title_en: 'Impeccable service',
      text_de: 'Ich habe einen Anzug für eine Hochzeit bestellt. Der Fall ist perfekt und der Stoff ist luxuriös. Der Kundenservice war sehr reaktionsschnell, um meine Fragen zu beantworten.',
      text_fr: 'J\'ai commandé un costume pour un mariage. Le tombé est parfait et le tissu est luxueux. Le service client a été très réactif pour répondre à mes questions.',
      text_en: 'I ordered a suit for a wedding. The drape is perfect and the fabric is luxurious. The customer service was very responsive to my questions.',
    },
    {
      name: 'Clara M.',
      image: '/images/products/robe-midi-en-soie-gucci.jpg',
      rating: 5,
      title_de: 'Eine wundervolle Entdeckung',
      title_fr: 'Une merveilleuse découverte',
      title_en: 'A wonderful discovery',
      text_de: 'Ich bin zufällig auf diese Seite gestoßen und bin nicht enttäuscht. Mein Seidenkleid ist umwerfend. Man hat das Gefühl, ein echtes Luxusprodukt zu einem fairen Preis zu kaufen.',
      text_fr: 'Je suis tombée sur ce site par hasard et je ne suis pas déçue. Ma robe en soie est sublime. On sent qu\'on achète un vrai produit de luxe à un prix juste.',
      text_en: 'I came across this site by chance and I am not disappointed. My silk dress is sublime. You feel like you are buying a real luxury product at a fair price.',
    },
    {
      name: 'Thomas G.',
      image: '/images/products/polo-pique-ralph-lauren.jpg',
      rating: 5,
      title_de: 'Qualität und Stil',
      title_fr: 'Qualité et style',
      title_en: 'Quality and style',
      text_de: 'Das Poloshirt von Ralph Lauren ist ein Klassiker, aber die Qualität hier ist wirklich top. Schnelle Lieferung. Ich bin ein treuer Kunde geworden.',
      text_fr: 'Le polo Ralph Lauren est un classique, mais la qualité ici est vraiment supérieure. Livraison rapide. Je suis devenu un client fidèle.',
      text_en: 'The Ralph Lauren polo is a classic, but the quality here is truly top-notch. Fast delivery. I have become a loyal customer.',
    },
    {
      name: 'Isabelle R.',
      image: '/images/products/echarpe-oversize-fausse-fourrure-luxe-soft.jpg',
      rating: 5,
      title_de: 'So luxuriös!',
      title_fr: 'Tellement luxueux !',
      title_en: 'So luxurious!',
      text_de: 'Der Schal aus Kunstpelz ist unglaublich weich und warm. Er verleiht all meinen Winteroutfits einen Hauch von Glamour. Ich liebe ihn!',
      text_fr: 'L\'écharpe en fausse fourrure est incroyablement douce et chaude. Elle ajoute une touche de glamour à toutes mes tenues d\'hiver. J\'adore !',
      text_en: 'The faux fur scarf is incredibly soft and warm. It adds a touch of glamour to all my winter outfits. I love it!',
    },
  ], []);

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[70vh] min-h-[500px] w-full flex-col items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/header.jpg"
            alt="EZCENTIALS Header"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700"
            priority
            quality={90}
            onError={(e) => {
              console.error('Failed to load header image');
              e.currentTarget.src = '/images/logo.png';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="container px-4 z-10">
          <p className="text-sm uppercase tracking-widest text-white/90 animate-fade-in-up font-medium">
             <TranslatedText fr="BIENVENUE CHEZ EZCENTIALS" en="WELCOME TO EZCENTIALS">WILLKOMMEN BEI EZCENTIALS</TranslatedText>
          </p>
          <h1 className="mt-4 font-headline text-5xl sm:text-6xl md:text-8xl lg:text-9xl animate-fade-in-up drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
            <TranslatedText fr="L'Excellence du Luxe" en="The Excellence of Luxury">Die Exzellenz des Luxus</TranslatedText>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-white/95 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s' }}>
             <TranslatedText fr="Découvrez notre sélection exclusive de vêtements et accessoires haut de gamme." en="Discover our exclusive selection of high-end clothing and accessories.">Entdecken Sie unsere exklusive Auswahl an hochwertiger Kleidung und Accessoires.</TranslatedText>
          </p>
          <Button size="lg" asChild className="mt-8 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/products/all" prefetch={true}>
              <TranslatedText fr="Explorer la collection" en="Explore the Collection">Die Kollektion entdecken</TranslatedText>
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full bg-gradient-to-b from-background to-muted/30 py-16 lg:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-5xl text-foreground mb-4">
                    <TranslatedText fr="Menu Maison" en="Home Menu">Menu Maison</TranslatedText>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    <TranslatedText 
                        fr="Découvrez nos collections exclusives soigneusement sélectionnées" 
                        en="Discover our exclusive, carefully curated collections"
                    >
                        Entdecken Sie unsere exklusiven, sorgfältig kuratierten Kollektionen
                    </TranslatedText>
                </p>
            </div>
             <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {[...categories].sort((a, b) => {
                        const aHasSub = a.subcategories && a.subcategories.length > 0;
                        const bHasSub = b.subcategories && b.subcategories.length > 0;
                        if (aHasSub && !bHasSub) return -1;
                        if (!aHasSub && bHasSub) return 1;
                        return 0;
                    }).map((category, index) => (
                        <CarouselItem key={category.id || index} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2 lg:basis-1/3">
                             <CategoryCard 
                                pretitle={<TranslatedText fr="CATÉGORIE" en="CATEGORY">KATEGORIE</TranslatedText>}
                                title={<TranslatedText fr={category.name_fr} en={category.name_en}>{category.name}</TranslatedText>}
                                description={<TranslatedText fr={`Explorez notre collection ${category.name_fr}.`} en={`Explore our ${category.name_en} collection.`}>Entdecken Sie unsere {category.name}-Kollektion.</TranslatedText>}
                                linkText={<TranslatedText fr="EXPLORER" en="DISCOVER">ENTDECKEN</TranslatedText>}
                                href={`/products/${category.slug}`}
                                imageId={category.imageId}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
      </section>



      {/* Section Promotions de fin d'année - Design Sublime et Élégant */}
      {Object.keys(endOfYearPromoProducts).length > 0 && (
        <section className="relative w-full overflow-hidden">
          {/* Bannière Hero Élégante et Sublime */}
          <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background avec effet de luxe premium */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-red-950/90 to-amber-950/90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/40 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/40 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-[url('/images/products/hiver.jpg')] opacity-15 mix-blend-overlay bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
            
            {/* Effets de lumière animés élégants */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>
            
            {/* Motif décoratif élégant */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)`
              }}></div>
            </div>

            {/* Étoiles scintillantes élégantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-amber-300 rounded-full shadow-lg shadow-amber-300/60 animate-ping"></div>
                  <div className="absolute inset-0 w-3 h-3 border border-amber-400/30 rounded-full animate-ping" style={{ animationDelay: `${Math.random() * 2}s` }}></div>
                </div>
              ))}
            </div>
            
            {/* Flocons de neige élégants */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={`snow-${i}`}
                  className="absolute text-white/20 text-2xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${-10 + Math.random() * 20}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                >
                  ❄
                </div>
              ))}
            </div>

            {/* Contenu de la bannière - Design Sublime */}
            <div className="container relative z-10 mx-auto px-4 text-center">
              {/* Emojis animés élégants */}
              <div className="inline-block mb-8">
                <span className="text-7xl md:text-8xl lg:text-9xl animate-bounce inline-block filter drop-shadow-2xl" style={{ animationDelay: '0s', textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>🎄</span>
                <span className="text-7xl md:text-8xl lg:text-9xl animate-bounce inline-block mx-4 md:mx-6 filter drop-shadow-2xl" style={{ animationDelay: '0.3s', textShadow: '0 0 20px rgba(220, 38, 38, 0.5)' }}>🎁</span>
                <span className="text-7xl md:text-8xl lg:text-9xl animate-bounce inline-block filter drop-shadow-2xl" style={{ animationDelay: '0.6s', textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}>✨</span>
              </div>
              
              {/* Sous-titre élégant */}
              <div className="mb-6">
                <p className="text-sm md:text-base uppercase tracking-[0.4em] font-bold text-white/95 mb-2">
                  <TranslatedText fr="PROMOTIONS DE FIN D'ANNÉE" en="END OF YEAR PROMOTIONS">JAHRESENDPROMOTIONEN</TranslatedText>
                </p>
                <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400/50 to-red-400"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-green-400/50 to-green-400"></div>
                </div>
              </div>
              
              {/* Titre principal sublime */}
              <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] mb-8 leading-tight">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-red-400 via-amber-300 to-green-400 blur-2xl opacity-50"></span>
                  <span className="relative bg-gradient-to-r from-red-400 via-amber-300 to-green-400 bg-clip-text text-transparent drop-shadow-2xl">
                    <TranslatedText fr="Soldes Exceptionnels" en="Exceptional Sales">Außergewöhnliche Angebote</TranslatedText>
                  </span>
                </span>
              </h1>
              
              {/* Description élégante */}
              <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-white/95 leading-relaxed font-light">
                <TranslatedText 
                  fr="Célébrez les fêtes avec nos promotions exclusives ! Jusqu'à -20% sur une sélection de produits de toutes les catégories." 
                  en="Celebrate the holidays with our exclusive promotions! Up to -20% off on a selection of products from all categories."
                >
                  Feiern Sie die Feiertage mit unseren exklusiven Aktionen! Bis zu -20% Rabatt auf eine Auswahl von Produkten aus allen Kategorien.
                </TranslatedText>
              </p>

              {/* Badge de réduction premium */}
              <div className="mt-12 inline-block">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-amber-500 to-green-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-red-600 via-amber-500 to-green-600 text-white px-10 py-5 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl md:text-5xl font-black">-20%</span>
                      <div className="h-12 w-px bg-white/30"></div>
                      <span className="text-sm md:text-base uppercase tracking-widest font-semibold">
                        <TranslatedText fr="Jusqu'à" en="Up to">Bis zu</TranslatedText>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vague décorative en bas */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg className="w-full h-24 md:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="text-background"></path>
              </svg>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="relative bg-background py-16 lg:py-24">
            {/* Effet de fond subtil */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background"></div>
            
            <div className="container relative z-10 mx-auto px-4">

              {/* Produits par catégorie - Garmin en premier */}
              {Object.entries(endOfYearPromoProducts).map(([category, categoryProducts], categoryIndex) => {
                const categoryInfo = categories.find(c => c.slug === category);
                if (!categoryInfo || categoryProducts.length === 0) return null;

                const isGarmin = category === 'garmin-watch';

                return (
                  <div key={category} className={`mb-20 last:mb-0 ${isGarmin ? 'relative' : ''}`}>
                    {/* Bannière de catégorie élégante */}
                    <div className={`relative mb-12 ${isGarmin ? 'bg-gradient-to-r from-amber-50 via-red-50 to-green-50 dark:from-amber-950/40 dark:via-red-950/30 dark:to-green-950/40 rounded-2xl p-8 md:p-12 border-2 border-amber-300/50 shadow-xl' : 'bg-muted/50 rounded-xl p-6 md:p-8'}`}>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {isGarmin && (
                            <div className="text-5xl md:text-6xl animate-pulse">⌚</div>
                          )}
                          <div>
                            <h3 className={`text-2xl md:text-4xl font-bold ${isGarmin ? 'bg-gradient-to-r from-red-600 via-amber-600 to-green-600 bg-clip-text text-transparent' : 'text-foreground'}`}>
                              <TranslatedText fr={categoryInfo.name_fr} en={categoryInfo.name_en}>
                                {categoryInfo.name}
                              </TranslatedText>
                            </h3>
                            {isGarmin && (
                              <p className="mt-2 text-sm md:text-base font-semibold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                                <TranslatedText fr="⭐ Collection Premium en Promotion ⭐" en="⭐ Premium Collection on Sale ⭐">
                                  ⭐ Premium-Kollektion im Angebot ⭐
                                </TranslatedText>
                              </p>
                            )}
                          </div>
                          {isGarmin && (
                            <div className="text-5xl md:text-6xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-400"></div>
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">
                            <TranslatedText fr={`${categoryProducts.length} Produits`} en={`${categoryProducts.length} Products`}>
                              {categoryProducts.length} Produkte
                            </TranslatedText>
                          </span>
                          <div className="h-px w-12 bg-gradient-to-l from-transparent to-green-400"></div>
                        </div>
                      </div>
                    </div>

                    {/* Grille de produits élégante */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {categoryProducts.map((product, index) => {
                        const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
                        return (
                          <div 
                            key={product.id} 
                            className={`group animate-fade-in-up transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${isGarmin ? 'hover:shadow-2xl hover:shadow-amber-500/20' : 'hover:shadow-xl'}`}
                            style={{ animationDelay: `${(categoryIndex * 0.3) + (index * 0.1)}s` }}
                          >
                            <div className="relative h-full">
                              {/* Badge promotion élégant */}
                              <div className={`absolute -top-3 -right-3 z-30 ${isGarmin ? 'bg-gradient-to-br from-red-600 via-amber-500 to-green-600' : 'bg-gradient-to-br from-red-600 to-amber-600'} text-white font-bold px-3 py-1.5 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                                <div className="text-xs md:text-sm">-{discount}%</div>
                              </div>
                              
                              {/* Badge "PROMO" */}
                              <div className={`absolute -top-3 -left-3 z-30 bg-gradient-to-r ${isGarmin ? 'from-amber-500 to-green-500' : 'from-red-500 to-amber-500'} text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg uppercase tracking-wider`}>
                                <TranslatedText fr="PROMO" en="SALE">ANGEBOT</TranslatedText>
                              </div>

                              <div className={`h-full ${isGarmin ? 'border-2 border-amber-200/50 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50/30 to-green-50/30 dark:from-amber-950/20 dark:to-green-950/20' : 'rounded-lg overflow-hidden'}`}>
                                <ProductCard product={product} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bouton de catégorie élégant */}
                    <div className="mt-10 text-center">
                      <Button 
                        asChild 
                        variant="outline" 
                        size="lg"
                        className={`border-2 transition-all duration-300 hover:scale-105 ${isGarmin 
                          ? 'border-amber-500 text-amber-600 hover:bg-gradient-to-r hover:from-red-500 hover:via-amber-500 hover:to-green-500 hover:text-white hover:border-transparent bg-gradient-to-r from-red-50/50 to-green-50/50 dark:from-red-950/30 dark:to-green-950/30 shadow-lg' 
                          : 'border-red-500 text-red-600 hover:bg-red-500 hover:text-white shadow-md'
                        }`}
                      >
                        <Link href={`/products/${category}`} prefetch={true}>
                          <TranslatedText fr={`Voir tous les produits ${categoryInfo.name_fr}`} en={`View All ${categoryInfo.name_en} Products`}>
                            Alle {categoryInfo.name} Produkte anzeigen
                          </TranslatedText>
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Bannière CTA finale élégante */}
              <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-amber-500 to-green-600 p-1">
                <div className="relative bg-background rounded-3xl p-8 md:p-12">
                  <div className="text-center">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-amber-600 to-green-600 bg-clip-text text-transparent">
                      <TranslatedText fr="Découvrez Toutes Nos Promotions" en="Discover All Our Promotions">
                        Entdecken Sie Alle Unsere Angebote
                      </TranslatedText>
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                      <TranslatedText 
                        fr="Explorez notre collection complète de produits en promotion. Des offres exceptionnelles vous attendent !" 
                        en="Explore our complete collection of products on sale. Exceptional offers await you!"
                      >
                        Erkunden Sie unsere vollständige Kollektion von Produkten im Angebot. Außergewöhnliche Angebote warten auf Sie!
                      </TranslatedText>
                    </p>
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-gradient-to-r from-red-600 via-amber-500 to-green-600 hover:from-red-700 hover:via-amber-600 hover:to-green-700 text-white shadow-2xl transform transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
                    >
                      <Link href="/products/all" prefetch={true}>
                        <TranslatedText fr="Voir toutes les promotions" en="View All Promotions">
                          Alle Angebote anzeigen
                        </TranslatedText>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <CollectionHighlight 
        supertitle={<TranslatedText fr="COLLECTION HIVER" en="WINTER COLLECTION">WINTER KOLLEKTION</TranslatedText>}
        title={<TranslatedText fr="Élégance Hivernale" en="Winter Elegance">Winterliche Eleganz</TranslatedText>}
        description={<TranslatedText fr="Nos collections d'hiver allient confort, chaleur et style intemporel. Chaque pièce est sélectionnée pour sa qualité exceptionnelle et ses finitions impeccables." en="Our winter collections combine comfort, warmth, and timeless style. Each piece is selected for its exceptional quality and flawless finishes.">Unsere Winterkollektionen vereinen Komfort, Wärme und zeitlosen Stil. Jedes Stück wird aufgrund seiner außergewöhnlichen Qualität und tadellosen Verarbeitung ausgewählt.</TranslatedText>}
        stats={[
          { value: '40+', label: <TranslatedText fr="PRODUITS" en="PRODUCTS">PRODUKTE</TranslatedText> },
          { value: '4.9/5', label: <TranslatedText fr="ÉVALUATION" en="RATING">BEWERTUNG</TranslatedText> },
          { value: '100%', label: 'PREMIUM' },
        ]}
        imageIds={[
          'blouson-cuir-saint-laurent',
          'robe-longue-en-velours-valentino',
          'bottines-chelsea-cuir-citadin',
           'montre-sport-silicone-hydrosport-5-atm'
        ]}
        primaryActionLink="/products/winter-clothing"
        primaryActionText={<TranslatedText fr="Voir la Collection" en="View the Collection">Kollektion ansehen</TranslatedText>}
        secondaryActionLink="/products/all"
        secondaryActionText={<TranslatedText fr="Explorer" en="Explore">Erkunden</TranslatedText>}
      />

       <section className="bg-background py-16 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-5xl text-foreground">
                <TranslatedText fr="L'Expérience EZCENTIALS" en="The EZCENTIALS Experience">Das EZCENTIALS Erlebnis</TranslatedText>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                <TranslatedText fr="Plus qu'une marque, une promesse de qualité, de durabilité et d'élégance." en="More than a brand, a promise of quality, sustainability, and elegance.">Mehr als eine Marke, ein Versprechen von Qualität, Nachhaltigkeit und Eleganz.</TranslatedText>
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold"><TranslatedText fr="Savoir-Faire d'Exception" en="Exceptional Craftsmanship">Außergewöhnliche Handwerkskunst</TranslatedText></h3>
              <p className="mt-2 text-muted-foreground"><TranslatedText fr="Des pièces conçues par les meilleurs artisans." en="Pieces designed by the best artisans.">Stücke, die von den besten Handwerkern entworfen wurden.</TranslatedText></p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold"><TranslatedText fr="Matériaux Durables" en="Sustainable Materials">Nachhaltige Materialien</TranslatedText></h3>
              <p className="mt-2 text-muted-foreground"><TranslatedText fr="Des tissus nobles et respectueux de l'environnement." en="Noble and environmentally friendly fabrics.">Edle und umweltfreundliche Stoffe.</TranslatedText></p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-semibold"><TranslatedText fr="Service Client Dédié" en="Dedicated Customer Service">Engagierter Kundenservice</TranslatedText></h3>
              <p className="mt-2 text-muted-foreground"><TranslatedText fr="Une équipe à votre écoute pour une expérience parfaite." en="A team at your service for a perfect experience.">Ein Team, das Ihnen für ein perfektes Erlebnis zur Verfügung steht.</TranslatedText></p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-5xl text-foreground">
              <TranslatedText fr="Ce que disent nos clients" en="What Our Customers Say">
                Was unsere Kunden sagen
              </TranslatedText>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              <TranslatedText fr="Des expériences qui témoignent de notre engagement envers l'excellence." en="Experiences that testify to our commitment to excellence.">
                Erfahrungen, die von unserem Engagement für Exzellenz zeugen.
              </TranslatedText>
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col rounded-lg border bg-background p-8 shadow-sm">
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-grow text-lg text-foreground">
                    <p>
                      <TranslatedText fr={testimonial.text_fr} en={testimonial.text_en}>
                        {testimonial.text_de}
                      </TranslatedText>
                    </p>
                  </blockquote>
                </div>
                <footer className="mt-8">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} loading="lazy" />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <TranslatedText fr="Client vérifié" en="Verified Customer">
                          Verifizierter Kunde
                        </TranslatedText>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
