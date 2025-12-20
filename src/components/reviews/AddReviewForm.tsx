

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Send } from 'lucide-react';
import { useUser, useSupabase } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import type { Review, Product } from '@/lib/types';
import { sanitizeReviewComment } from '@/lib/security';


const reviewSchema = z.object({
  rating: z.number().min(1, 'La note est requise').max(5),
  comment: z.string().min(10, 'Le commentaire doit faire au moins 10 caractères.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function AddReviewForm({ productId, product }: { productId: string; product?: Product }) {
  const { user, profile } = useUser();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user || !supabase) {
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Vous devez être connecté" en="You must be logged in">Sie müssen angemeldet sein</TranslatedText>,
        description: <TranslatedText fr="Connectez-vous pour laisser un avis." en="Log in to leave a review.">Melden Sie sich an, um eine Bewertung abzugeben.</TranslatedText>,
      });
      return;
    }

    try {
        // Vérifier si le produit existe dans Supabase, sinon le créer
        const { data: existingProduct, error: checkError } = await supabase
          .from('products')
          .select('id')
          .eq('id', productId)
          .single();

        if (checkError && checkError.code === 'PGRST116' && product) {
          // Le produit n'existe pas, le créer
          const productData = {
            id: product.id,
            name: product.name,
            name_fr: product.name_fr,
            name_en: product.name_en,
            slug: product.slug,
            price: product.price,
            old_price: product.oldPrice || null,
            description: product.description,
            description_fr: product.description_fr,
            description_en: product.description_en,
            category: product.category,
            images: product.images || [],
            sizes: product.sizes || null,
            colors: product.colors || null,
          };

          const { error: insertError } = await supabase
            .from('products')
            .insert(productData);

          if (insertError) {
            console.error('Error creating product in Supabase:', insertError);
            // Continuer quand même, peut-être que le produit existe déjà
          }
        } else if (checkError && checkError.code !== 'PGRST116') {
          // Autre erreur
          console.error('Error checking product:', checkError);
        }

        // Sanitize comment to prevent XSS
        const sanitizedComment = sanitizeReviewComment(data.comment);
        
        const userName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : user.email?.split('@')[0] || 'Utilisateur Anonyme';
        
        const reviewData = {
          product_id: productId,
          user_id: user.id,
          user_name: userName,
          rating: data.rating,
          comment: sanitizedComment,
          comment_fr: sanitizedComment,
          comment_en: sanitizedComment,
        };

        const { error } = await supabase
          .from('reviews')
          .insert(reviewData as any);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: <TranslatedText fr="Avis ajouté !" en="Review added!">Bewertung hinzugefügt!</TranslatedText>,
          description: <TranslatedText fr="Merci pour votre contribution. Votre avis sera visible après un court instant." en="Thank you for your contribution. Your review will be visible shortly.">Vielen Dank für Ihren Beitrag. Ihre Bewertung wird in Kürze sichtbar sein.</TranslatedText>,
        });

        reset();

    } catch (error: any) {
        console.error("Error adding review: ", error);
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
            description: error.message || <TranslatedText fr="Impossible d'ajouter l'avis. Veuillez réessayer." en="Unable to add review. Please try again.">Bewertung konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut.</TranslatedText>,
        });
    }
  };

  return (
    <div className="mt-10 border-t pt-8">
      <h4 className="font-headline text-xl mb-4">
        <TranslatedText fr="Laisser un avis" en="Leave a Review">Eine Bewertung abgeben</TranslatedText>
      </h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label><TranslatedText fr="Votre note" en="Your Rating">Ihre Bewertung</TranslatedText></Label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-6 w-6 cursor-pointer transition-colors',
                      field.value >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'
                    )}
                    onClick={() => field.onChange(star)}
                  />
                ))}
              </div>
            )}
          />
          {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
        </div>

        <div>
          <Label htmlFor="comment"><TranslatedText fr="Votre commentaire" en="Your Comment">Ihr Kommentar</TranslatedText></Label>
          <Textarea
            id="comment"
            {...register('comment')}
            className="mt-2"
            rows={4}
            disabled={!user || isSubmitting}
            placeholder={!user ? "Connectez-vous pour laisser un avis" : "Écrivez votre avis ici..."}
          />
          {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
        </div>

        <Button type="submit" disabled={!user || isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? <TranslatedText fr="Envoi..." en="Submitting...">Senden...</TranslatedText> : <TranslatedText fr="Envoyer l'avis" en="Submit Review">Bewertung abschicken</TranslatedText>}
        </Button>
        {!user && <p className="text-sm text-muted-foreground mt-2"><TranslatedText fr="Vous devez être connecté pour laisser un avis." en="You must be logged in to leave a review.">Sie müssen angemeldet sein, um eine Bewertung abzugeben.</TranslatedText></p>}
      </form>
    </div>
  );
}
