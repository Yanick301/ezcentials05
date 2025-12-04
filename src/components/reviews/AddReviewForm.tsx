

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Send } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import type { Review } from '@/lib/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


const reviewSchema = z.object({
  rating: z.number().min(1, 'La note est requise').max(5),
  comment: z.string().min(10, 'Le commentaire doit faire au moins 10 caractères.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function AddReviewForm({ productId }: { productId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Vous devez être connecté',
        description: "Connectez-vous pour laisser un avis.",
      });
      return;
    }

    try {
        const reviewData = {
          userId: user.uid,
          userName: user.displayName || 'Utilisateur Anonyme',
          rating: data.rating,
          comment: data.comment,
          createdAt: serverTimestamp(),
          // We could add translated versions here if we had an AI translation service
          comment_de: data.comment,
          comment_fr: data.comment,
          comment_en: data.comment,
        };

        const reviewsColRef = collection(firestore, 'products', productId, 'reviews');
        await addDoc(reviewsColRef, reviewData);
        
        toast({
          title: "Avis ajouté !",
          description: "Merci pour votre contribution. Votre avis sera visible après un court instant.",
        });

        reset();

    } catch (error) {
        console.error("Error adding review: ", error);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible d'ajouter l'avis. Veuillez réessayer.",
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
