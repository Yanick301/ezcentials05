
'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TranslatedText } from '../TranslatedText';

type AddToFavoritesButtonProps = {
  productId: string;
} & ButtonProps;

export function AddToFavoritesButton({
  productId,
  className,
  ...props
}: AddToFavoritesButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(productId);

  return (
    <Button
      className={cn(className)}
      onClick={(e) => {
        e.preventDefault(); // Prevent link navigation on product card
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      {...props}
    >
      <Heart
        className={cn('h-5 w-5 transition-colors', {
          'fill-primary text-primary': isFav,
          'text-muted-foreground': !isFav,
        })}
      />
       <span className="sr-only"><TranslatedText fr="Ajouter aux favoris" en="Add to favorites">Zu den Favoriten hinzufügen</TranslatedText></span>
    </Button>
  );
}
