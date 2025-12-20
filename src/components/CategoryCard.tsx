
import Link from 'next/link';
import Image from 'next/image';
import { findProductImage } from '@/lib/image-utils';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

type CategoryCardProps = {
    pretitle: ReactNode;
    title: ReactNode;
    description: ReactNode;
    linkText: ReactNode;
    href: string;
    imageId: string;
};

export function CategoryCard({ pretitle, title, description, linkText, href, imageId }: CategoryCardProps) {
    const image = useMemo(() => 
        findProductImage(imageId),
        [imageId]
    );

    if (!image) {
        console.warn(`Image not found for category: ${imageId}`);
        return (
            <Link href={href} className="group relative block aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex items-center justify-center">
                <div className="text-center p-6">
                    <p className="text-sm text-muted-foreground">{title?.toString() || 'Category'}</p>
                </div>
            </Link>
        );
    }

    return (
        <Link 
            href={href} 
            className="group relative block aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            prefetch={true}
            aria-label={`${title?.toString() || 'Category'} - ${description?.toString() || ''}`}
        >
            <Image
                src={image.imageUrl}
                alt={title?.toString() || 'Category'}
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                data-ai-hint={image.imageHint}
                onError={(e) => {
                    console.error(`Failed to load image: ${image.imageUrl}`);
                    e.currentTarget.src = '/images/logo.png';
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10">
                <p className="text-xs md:text-sm uppercase tracking-widest text-white/80 font-medium">{pretitle}</p>
                <h3 className="mt-2 font-headline text-3xl md:text-4xl font-bold drop-shadow-lg">{title}</h3>
                <p className="mt-2 max-w-xs text-sm text-white/90 leading-relaxed">{description}</p>
                <div className="mt-4 md:mt-6 flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 group-hover:translate-x-2 group-hover:text-white">
                    {linkText} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
