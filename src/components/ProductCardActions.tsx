
'use client';

import { Product } from '@/lib/types';
import { Button } from './ui/button';
import { Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';

export function ProductCardActions({ product }: { product: Product }) {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    const defaultColor = product.colors ? product.colors[0] : undefined;
    addToCart({
      product,
      quantity: 1,
      size: defaultSize,
      color: defaultColor,
    });
    toast({
      title: 'Ajouté au panier !',
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 rounded-full border bg-background/80 p-1.5 backdrop-blur-sm">
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted" onClick={handleAddToCart}>
        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
        <Link href={`/product/${product.slug}`}>
            <Eye className="h-5 w-5 text-muted-foreground" />
        </Link>
      </Button>
    </div>
  );
}
