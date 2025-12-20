

'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/ProductCard';
import { findProductImage } from '@/lib/image-utils';
import { TranslatedText } from '@/components/TranslatedText';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { getProductBySlug, getProductsByCategory, products as allProducts, categories } from '@/lib/data';
import type { Review, Product } from '@/lib/types';
import { Breadcrumbs, useBreadcrumbsForProduct } from '@/components/Breadcrumbs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AddReviewForm from '@/components/reviews/AddReviewForm';
import EditReviewForm from '@/components/reviews/EditReviewForm';
import { useUser, useSupabase, useCollection } from '@/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProductPageSkeleton } from '@/components/skeletons/ProductPageSkeleton';
import { SEOHead } from '@/components/SEOHead';


export default function ProductPage() {
  const params = useParams();
  const { language } = useLanguage();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<ReturnType<typeof getProductsByCategory>>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { supabase } = useSupabase();

  useEffect(() => {
    setIsLoadingProduct(true);
    const foundProduct = getProductBySlug(allProducts, slug);
    
    if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0].name_de); // Default to German name for value
        }
        const related = getProductsByCategory(allProducts, foundProduct.category, 4, foundProduct.id);
        setRelatedProducts(related);
    }
    
    setIsLoadingProduct(false);
  }, [slug]);

  // Supabase query for reviews (DB row shape)
  type DbReview = {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    comment: string;
    comment_fr: string | null;
    comment_en: string | null;
    created_at: string;
    updated_at: string;
  };

  const { data: dbReviews, isLoading: isLoadingReviews } = useCollection<DbReview>(
    'reviews',
    product
      ? {
          filter: (query) => query.eq('product_id', product.id),
          orderBy: { column: 'created_at', ascending: false },
        }
      : undefined
  );

  const reviews = useMemo<Review[]>(() => {
    if (!dbReviews) return [];
    return dbReviews.map((r) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id,
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      comment_fr: r.comment_fr ?? undefined,
      comment_en: r.comment_en ?? undefined,
      createdAt: r.created_at,
    }));
  }, [dbReviews]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [reviews]);


  // Dynamically update document title
  useEffect(() => {
    if (typeof window !== 'undefined' && product) {
        let productName;
        switch(language) {
            case 'fr': productName = product.name_fr; break;
            case 'en': productName = product.name_en; break;
            default: productName = product.name;
        }
        document.title = `${productName} | EZCENTIALS`;
    }
  }, [product, language]);
  
  const handleReviewUpdated = () => {
    setEditingReviewId(null);
  };
  
  const handleDeleteReview = async () => {
    if (!reviewToDelete || !supabase || !product) return;

    try {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewToDelete.id);

        if (error) throw error;
        toast({
            title: <TranslatedText fr="Avis supprimé" en="Review deleted">Bewertung gelöscht</TranslatedText>,
            description: <TranslatedText fr="Votre avis a été supprimé avec succès." en="Your review has been successfully deleted.">Ihre Bewertung wurde erfolgreich gelöscht.</TranslatedText>,
        });
    } catch (error) {
        console.error("Error deleting review: ", error);
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
            description: <TranslatedText fr="Impossible de supprimer l'avis. Veuillez réessayer." en="Unable to delete the review. Please try again.">Die Bewertung konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.</TranslatedText>,
        });
    } finally {
        setReviewToDelete(null);
    }
  };


  const averageRating = useMemo(() => {
    if (!sortedReviews || sortedReviews.length === 0) return 0;
    return sortedReviews.reduce((acc, review) => acc + review.rating, 0) / sortedReviews.length;
  }, [sortedReviews]);
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const getTranslatedReview = (review: Review) => {
    switch (language) {
      case 'fr':
        return (review as any).comment_fr || review.comment;
      case 'en':
        return (review as any).comment_en || review.comment;
      default:
        return (review as any).comment_de || review.comment;
    }
  }

  if (isLoadingProduct) {
    return <ProductPageSkeleton />;
  }
  
  if (!isLoadingProduct && !product) {
    notFound();
  }

  if (!product) {
    return null; // Should be handled by notFound, but for type safety
  }
  
  const mainImage = findProductImage(product.images[0]);
  const altImages = product.images.slice(1).map(id => findProductImage(id));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      product,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    });
    toast({
      title: <TranslatedText fr="Ajouté au panier !" en="Added to cart!">Zum Warenkorb hinzugefügt!</TranslatedText>,
      description: (
        <TranslatedText 
          fr={`${product.name_fr} a été ajouté à votre panier.`} 
          en={`${product.name_en} has been added to your cart.`}
        >
          {`${product.name} wurde Ihrem Warenkorb hinzugefügt.`}
        </TranslatedText>
      ),
    });
  };

  const category = categories.find(c => c.slug === product.category);
  const breadcrumbs = useBreadcrumbsForProduct(product, category);

  return (
    <>
      {product && <SEOHead product={product} type="product" />}
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbs} />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
            {mainImage && (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                    <Image
                        src={mainImage.imageUrl}
                        alt={language === 'fr' ? product.name_fr : language === 'en' ? product.name_en : product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                        data-ai-hint={mainImage.imageHint}
                    />
                </div>
            )}
            <div className="grid grid-cols-3 gap-4">
                {altImages.map(img => img && (
                    <div key={img.id} className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                        <Image
                            src={img.imageUrl}
                            alt={`${language === 'fr' ? product.name_fr : language === 'en' ? product.name_en : product.name} - ${language === 'fr' ? 'Vue alternative' : language === 'en' ? 'Alternative view' : 'Alternative Ansicht'}`}
                            fill
                            sizes="(max-width: 768px) 33vw, 150px"
                            className="object-cover"
                            loading="lazy"
                            data-ai-hint={img.imageHint}
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-headline text-3xl md:text-4xl"><TranslatedText fr={product.name_fr} en={product.name_en}>{product.name}</TranslatedText></h1>
          <p className="mt-2 text-2xl text-muted-foreground">€{product.price.toFixed(2)}</p>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn(
                  'h-5 w-5',
                  averageRating > i ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'
                )} />
              ))}
            </div>
            {sortedReviews && sortedReviews.length > 0 && (
                <span className="text-sm text-muted-foreground">
                    ({sortedReviews.length} <TranslatedText fr="avis" en="reviews">Bewertungen</TranslatedText>)
                </span>
            )}
          </div>

          <p className="mt-6 text-base leading-relaxed">
            <TranslatedText fr={product.description_fr} en={product.description_en}>{product.description}</TranslatedText>
          </p>

          <div className="mt-8 space-y-6">
            {product.sizes && product.sizes.length > 0 && (
                <div>
                    <Label className="text-sm font-medium"><TranslatedText fr="Taille" en="Size">Größe</TranslatedText></Label>
                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="mt-2 flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                            <RadioGroupItem key={size} value={size} id={`size-${size}`} className="sr-only" />
                        ))}
                        {product.sizes.map(size => (
                            <Label 
                                key={size} 
                                htmlFor={`size-${size}`}
                                className={cn(
                                    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm transition-colors',
                                    selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
                                )}
                            >{size}</Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
             {product.colors && product.colors.length > 0 && (
                <div>
                    <Label className="text-sm font-medium"><TranslatedText fr="Couleur" en="Color">Farbe</TranslatedText></Label>
                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="mt-2 flex flex-wrap gap-2">
                         {product.colors.map(color => (
                            <RadioGroupItem key={color.name_de} value={color.name_de} id={`color-${color.name_de}`} className="sr-only" />
                        ))}
                        {product.colors.map(color => (
                            <Label 
                                key={color.name_de} 
                                htmlFor={`color-${color.name_de}`}
                                className={cn(
                                    'flex h-10 cursor-pointer items-center justify-center rounded-md border px-4 text-sm transition-colors',
                                    selectedColor === color.name_de ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
                                )}
                            >
                              <TranslatedText fr={color.name_fr} en={color.name_en}>{color.name_de}</TranslatedText>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <TranslatedText fr="Ajouter au panier" en="Add to Cart">In den Warenkorb</TranslatedText>
            </Button>
          </div>

          <Separator className="my-8" />
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details"><TranslatedText fr="Détails" en="Details">Details</TranslatedText></TabsTrigger>
              <TabsTrigger value="reviews"><TranslatedText fr="Avis" en="Reviews">Bewertungen</TranslatedText> ({sortedReviews?.length || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-2">
                <li><TranslatedText fr="Fabriqué avec des matériaux de haute qualité" en="Made with high-quality materials">Hergestellt aus hochwertigen Materialien</TranslatedText></li>
                <li><TranslatedText fr="Conçu pour le confort et le style" en="Designed for comfort and style">Entworfen für Komfort und Stil</TranslatedText></li>
                <li><TranslatedText fr="Approvisionnement durable" en="Sustainably sourced">Nachhaltig bezogen</TranslatedText></li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-8">
                {isLoadingReviews ? (
                    <p>
                      <TranslatedText fr="Chargement des avis..." en="Loading reviews...">Bewertungen werden geladen...</TranslatedText>
                    </p>
                ) : sortedReviews.length > 0 ? (
                  sortedReviews.map((review) => (
                      <div key={review.id} className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {editingReviewId === review.id ? (
                            <EditReviewForm 
                                review={review} 
                                productId={product.id} 
                                onReviewUpdated={handleReviewUpdated}
                                onCancel={() => setEditingReviewId(null)}
                            />
                          ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{review.userName}</p>
                                    <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                        key={i}
                                        className={cn(
                                            'h-4 w-4',
                                            review.rating > i ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'
                                        )}
                                        />
                                    ))}
                                    </div>
                                </div>
                                <p className="mt-2 text-muted-foreground">{getTranslatedReview(review)}</p>
                                {user && user.id === review.userId && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingReviewId(review.id)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setReviewToDelete(review)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground" />
                    <h4 className="mt-4 text-lg font-semibold"><TranslatedText fr="Aucun avis pour l'instant" en="No reviews yet">Noch keine Bewertungen</TranslatedText></h4>
                    <p className="mt-1 text-muted-foreground"><TranslatedText fr="Soyez le premier à donner votre avis sur ce produit !" en="Be the first to review this product!">Seien Sie der Erste, der dieses Produkt bewertet!</TranslatedText></p>
                  </div>
                )}
              </div>
              <AddReviewForm productId={product.id} product={product} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24">
        <h2 className="mb-12 text-center font-headline text-3xl md:text-4xl">
          <TranslatedText fr="Vous pourriez aussi aimer" en="You Might Also Like">Das könnte Ihnen auch gefallen</TranslatedText>
        </h2>
        {relatedProducts && relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
        ): (
            <div className="text-center"><TranslatedText fr="Chargement..." en="Loading...">Laden...</TranslatedText></div>
        )}
      </div>
      
      <AlertDialog open={!!reviewToDelete} onOpenChange={(isOpen) => !isOpen && setReviewToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle><TranslatedText fr="Confirmer la suppression" en="Confirm Deletion">Löschung bestätigen</TranslatedText></AlertDialogTitle>
                <AlertDialogDescription>
                    <TranslatedText fr="Êtes-vous sûr de vouloir supprimer votre avis ? Cette action est irréversible." en="Are you sure you want to delete your review? This action cannot be undone.">Sind Sie sicher, dass Sie Ihre Bewertung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</TranslatedText>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel><TranslatedText fr="Annuler" en="Cancel">Abbrechen</TranslatedText></AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteReview} className={buttonVariants({ variant: "destructive" })}>
                    <TranslatedText fr="Supprimer" en="Delete">Löschen</TranslatedText>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
