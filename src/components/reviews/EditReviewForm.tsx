
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Send } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import type { Review } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';

const reviewSchema = z.object({
  rating: z.number().min(1, 'La note est requise').max(5),
  comment: z.string().min(10, 'Le commentaire doit faire au moins 10 caractères.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface EditReviewFormProps {
  review: Review;
  productId: string;
  onReviewUpdated: () => void;
  onCancel: () => void;
}

export default function EditReviewForm({ review, productId, onReviewUpdated, onCancel }: EditReviewFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment,
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!firestore) return;
    
    try {
        const reviewRef = doc(firestore, 'products', productId, 'reviews', review.id);
        await updateDoc(reviewRef, {
            rating: data.rating,
            comment: data.comment,
            // Assuming we might want to translate on edit as well
            comment_de: data.comment,
            comment_fr: data.comment,
            comment_en: data.comment,
        });
        toast({
            title: "Avis mis à jour",
            description: "Votre avis a été modifié avec succès.",
        });
        onReviewUpdated();
    } catch (error) {
        console.error("Error updating review:", error);
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de modifier l'avis.",
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-muted/50 p-4">
      <div>
        <Label><TranslatedText fr="Votre note" en="Your Rating">Ihre Bewertung</TranslatedText></Label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <div className="mt-2 flex items-center gap-1">
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
        <Label htmlFor={`edit-comment-${review.id}`}><TranslatedText fr="Votre commentaire" en="Your Comment">Ihr Kommentar</TranslatedText></Label>
        <Textarea
          id={`edit-comment-${review.id}`}
          {...register('comment')}
          className="mt-2"
          rows={3}
        />
        {errors.comment && <p className="text-sm text-destructive mt-1">{errors.comment.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? <TranslatedText fr="Mise à jour..." en="Updating...">Aktualisierung...</TranslatedText> : <TranslatedText fr="Mettre à jour" en="Update">Aktualisieren</TranslatedText>}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
            <TranslatedText fr="Annuler" en="Cancel">Abbrechen</TranslatedText>
        </Button>
      </div>
    </form>
  );
}
