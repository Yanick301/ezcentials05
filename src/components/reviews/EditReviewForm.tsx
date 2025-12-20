
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Send } from 'lucide-react';
import { useSupabase } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import type { Review } from '@/lib/types';
import { sanitizeReviewComment } from '@/lib/security';

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
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review.rating,
      comment: review.comment,
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!supabase) return;
    
    try {
        // Sanitize comment to prevent XSS
        const sanitizedComment = sanitizeReviewComment(data.comment);
        
        const { error } = await supabase
          .from('reviews')
          .update({
            rating: data.rating,
            comment: sanitizedComment,
            comment_fr: sanitizedComment,
            comment_en: sanitizedComment,
          } as any)
          .eq('id', review.id);
        
        if (error) {
          throw error;
        }
        
        toast({
            title: <TranslatedText fr="Avis mis à jour" en="Review updated">Bewertung aktualisiert</TranslatedText>,
            description: <TranslatedText fr="Votre avis a été modifié avec succès." en="Your review has been successfully updated.">Ihre Bewertung wurde erfolgreich aktualisiert.</TranslatedText>,
        });
        onReviewUpdated();
    } catch (error: any) {
        console.error("Error updating review:", error);
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
            description: error.message || (
                <TranslatedText fr="Impossible de modifier l'avis." en="Unable to update the review.">Die Bewertung konnte nicht aktualisiert werden.</TranslatedText>
            ),
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
