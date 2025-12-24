
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
  const endOfYearPromoProducts = useMemo(() => {
    const categories = ['mens-clothing', 'womens-clothing', 'accessories', 'shoes', 'sport', 'winter-clothing', 'perfume', 'garmin-watch'];
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

      <section className="relative h-[50vh] min-h-[400px] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/products/hiver.jpg"
            alt="Winter Sale"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            quality={90}
            onError={(e) => {
              console.error('Failed to load winter sale image');
              e.currentTarget.src = '/images/header.jpg';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30"></div>
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-white/90 animate-fade-in-up font-medium"><TranslatedText fr="Jusqu'à -40%" en="Up to -40%">Bis zu -40%</TranslatedText></p>
            <h2 className="mt-4 font-headline text-4xl md:text-6xl lg:text-7xl animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
                <TranslatedText fr="Soldes d'Hiver" en="Winter Sale">Winter-Schlussverkauf</TranslatedText>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-white/95 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s' }}>
                 <TranslatedText fr="Embrassez l'élégance de la saison avec des pièces d'exception à des prix irrésistibles." en="Embrace the elegance of the season with exceptional pieces at irresistible prices.">Umfassen Sie die Eleganz der Saison mit außergewöhnlichen Stücken zu unwiderstehlichen Preisen.</TranslatedText>
            </p>
            <Button size="lg" asChild className="mt-8 hover:scale-105 transition-all duration-300 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Link href="/products/winter-clothing" prefetch={true}><TranslatedText fr="Découvrir les Offres" en="Discover the Offers">Angebote entdecken</TranslatedText></Link>
            </Button>
        </div>
      </section>


      <section className="w-full bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-5xl text-foreground">
              <TranslatedText fr="Notre Sélection Tendance" en="Our Trending Selection">Unsere Trend-Auswahl</TranslatedText>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              <TranslatedText fr="Profitez de nos offres exclusives sur une sélection d'articles. L'élégance intemporelle à prix réduit." en="Take advantage of our exclusive offers on a selection of items. Timeless elegance at a reduced price.">
                Profitieren Sie von unseren exklusiven Angeboten für eine Auswahl an Artikeln. Zeitlose Eleganz zum reduzierten Preis.
              </TranslatedText>
            </p>
          </div>
          {trendingProducts.length === 0 ? (
            <div className="text-center mt-12 text-muted-foreground">
              <TranslatedText fr="Chargement des produits..." en="Loading products...">Produkte werden geladen...</TranslatedText>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trendingProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Button asChild size="lg">
                <Link href="/products/winter-clothing" prefetch={true}><TranslatedText fr="Voir toutes les promotions" en="View All Promotions">Alle Angebote anzeigen</TranslatedText></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section Promotions de fin d'année - Design Fêtes */}
      {Object.keys(endOfYearPromoProducts).length > 0 && (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden">
          {/* Background avec effet de fêtes */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-green-50 to-amber-50 dark:from-red-950/20 dark:via-green-950/20 dark:to-amber-950/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
          
          {/* Étoiles animées */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              </div>
            ))}
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-4xl animate-bounce inline-block" style={{ animationDelay: '0s' }}>🎄</span>
                <span className="text-4xl animate-bounce inline-block mx-2" style={{ animationDelay: '0.2s' }}>🎁</span>
                <span className="text-4xl animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>✨</span>
              </div>
              <p className="text-sm uppercase tracking-widest font-bold mb-4 bg-gradient-to-r from-red-600 via-green-600 to-amber-600 bg-clip-text text-transparent">
                <TranslatedText fr="PROMOTIONS DE FIN D'ANNÉE" en="END OF YEAR PROMOTIONS">JAHRESENDPROMOTIONEN</TranslatedText>
              </p>
              <h2 className="font-headline text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-red-600 via-green-600 to-amber-600 bg-clip-text text-transparent">
                <TranslatedText fr="Soldes Exceptionnels" en="Exceptional Sales">Außergewöhnliche Angebote</TranslatedText>
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                <TranslatedText 
                  fr="Célébrez les fêtes avec nos promotions exclusives ! Jusqu'à -20% sur une sélection de produits de toutes les catégories." 
                  en="Celebrate the holidays with our exclusive promotions! Up to -20% off on a selection of products from all categories."
                >
                  Feiern Sie die Feiertage mit unseren exklusiven Aktionen! Bis zu -20% Rabatt auf eine Auswahl von Produkten aus allen Kategorien.
                </TranslatedText>
              </p>
            </div>

            {/* Produits par catégorie */}
            {Object.entries(endOfYearPromoProducts).map(([category, categoryProducts], categoryIndex) => {
              const categoryInfo = categories.find(c => c.slug === category);
              if (!categoryInfo || categoryProducts.length === 0) return null;

              return (
                <div key={category} className="mb-16 last:mb-0">
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
                    <h3 className="mx-6 text-2xl md:text-3xl font-bold text-foreground">
                      <TranslatedText fr={categoryInfo.name_fr} en={categoryInfo.name_en}>
                        {categoryInfo.name}
                      </TranslatedText>
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {categoryProducts.map((product, index) => (
                      <div 
                        key={product.id} 
                        className="animate-fade-in-up transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
                        style={{ animationDelay: `${(categoryIndex * 0.5) + (index * 0.1)}s` }}
                      >
                        <div className="relative">
                          {/* Badge promotion */}
                          <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            <TranslatedText fr="PROMO" en="SALE">ANGEBOT</TranslatedText>
                          </div>
                          <ProductCard product={product} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Button asChild variant="outline" className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
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

            <div className="mt-16 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-600 via-green-600 to-amber-600 hover:from-red-700 hover:via-green-700 hover:to-amber-700 text-white shadow-xl transform transition-all duration-300 hover:scale-105">
                <Link href="/products/all" prefetch={true}>
                  <TranslatedText fr="Voir toutes les promotions" en="View All Promotions">Alle Angebote anzeigen</TranslatedText>
                </Link>
              </Button>
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
