import placeholderImagesData from './placeholder-images.json';
import existingProductImages from './existing-images.json';

const { placeholderImages } = placeholderImagesData;

/**
 * Génère le chemin d'image pour un produit
 * Essaie d'abord de trouver dans placeholder-images.json, sinon génère directement le chemin
 */
export function getProductImageUrl(imageId: string): string {
  if (!imageId) {
    return '/images/logo.png';
  }

  // Chercher dans placeholder-images.json d'abord (pour les images existantes)
  const placeholderImage = placeholderImages.find(p => p.id === imageId);
  if (placeholderImage) {
    return placeholderImage.imageUrl;
  }

  // Vérifier si l'image existe dans notre inventaire
  const baseId = imageId.split('.')[0];
  if (existingProductImages.includes(baseId)) {
    return `/images/products/${baseId}.jpg`;
  }

  // Fallback vers le logo si l'image n'est pas trouvée
  return '/images/logo.png';
}

/**
 * Génère toutes les URLs d'images pour un produit
 */
export function getProductImageUrls(imageIds: string[]): string[] {
  if (!imageIds || imageIds.length === 0) {
    return ['/images/logo.png'];
  }

  return imageIds.map(id => getProductImageUrl(id));
}

/**
 * Trouve une image placeholder ou génère le chemin
 * Gère automatiquement les différentes extensions d'images
 */
export function findProductImage(imageId: string) {
  if (!imageId) {
    return {
      id: 'logo',
      imageUrl: '/images/logo.png',
      imageHint: 'product',
    };
  }

  // Chercher dans placeholder-images.json
  const placeholderImage = placeholderImages.find(p => p.id === imageId);
  if (placeholderImage) {
    return placeholderImage;
  }

  // Pour les images de catégories (qui se terminent par -category),
  // chercher dans /images/ au lieu de /images/products/
  if (imageId.endsWith('-category')) {
    return {
      id: imageId,
      imageUrl: `/images/${imageId}.jpg`,
      imageHint: 'category',
    };
  }

  // Vérifier si l'image existe dans notre inventaire
  const baseId = imageId.split('.')[0];
  if (existingProductImages.includes(baseId)) {
    return {
      id: imageId,
      imageUrl: `/images/products/${baseId}.jpg`,
      imageHint: 'product',
    };
  }

  // Si l'image n'existe pas, on renvoie le logo
  return {
    id: 'logo',
    imageUrl: '/images/logo.png',
    imageHint: 'product',
  };
}

