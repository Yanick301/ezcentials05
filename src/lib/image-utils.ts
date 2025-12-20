import placeholderImagesData from './placeholder-images.json';

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

  // Sinon, générer directement le chemin depuis l'ID
  // Les images sont stockées dans /public/images/products/
  // Format: /images/products/{imageId}.jpg
  // On essaie différentes extensions
  return `/images/products/${imageId}.jpg`;
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

  // Générer un objet image depuis l'ID
  // On essaie d'abord .jpg (le plus commun), mais le navigateur essaiera aussi .png, .webp, etc.
  // Si l'image n'existe pas, onError dans les composants affichera le logo
  return {
    id: imageId,
    imageUrl: `/images/products/${imageId}.jpg`,
    imageHint: 'product',
  };
}

