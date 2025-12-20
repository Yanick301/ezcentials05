'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback image
  const fallbackSrc = '/images/logo.png';

  if (error) {
    return (
      <div
        className={cn('bg-muted flex items-center justify-center', className)}
        style={width && height ? { width, height } : undefined}
      >
        <span className="text-muted-foreground text-sm">{alt}</span>
      </div>
    );
  }

  const imageProps = fill
    ? {
        fill: true,
        sizes,
        className: cn(
          'object-cover transition-opacity duration-300',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100',
          className
        ),
      }
    : {
        width: width || 400,
        height: height || 400,
        className: cn(
          'object-cover transition-opacity duration-300',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100',
          className
        ),
      };

  return (
    <Image
      src={src || fallbackSrc}
      alt={alt}
      {...imageProps}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setError(true);
        setIsLoading(false);
      }}
    />
  );
}















