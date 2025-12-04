
import Link from 'next/link';
import type { ReactNode } from 'react';
import placeholderImagesData from '@/lib/placeholder-images.json';
import { Button } from './ui/button';
import { products as allProducts } from '@/lib/data';

type Stat = {
    value: string;
    label: ReactNode;
}

type CollectionHighlightProps = {
    supertitle: ReactNode;
    title: ReactNode;
    description: ReactNode;
    stats: Stat[];
    imageIds: string[];
    primaryActionLink: string;
    primaryActionText: ReactNode;
    secondaryActionLink: string;
    secondaryActionText: ReactNode;
}

const { placeholderImages } = placeholderImagesData;

export function CollectionHighlight({
    supertitle,
    title,
    description,
    stats,
    imageIds,
    primaryActionLink,
    primaryActionText,
    secondaryActionLink,
    secondaryActionText,
}: CollectionHighlightProps) {

    const images = imageIds.map(id => {
        const image = placeholderImages.find(img => img.id === id);
        if (!image) return null;
        
        const product = allProducts.find(p => p.images.includes(id));
        return { ...image, slug: product?.slug };
    }).filter(Boolean);

    return (
        <section className="w-full bg-background py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="grid grid-cols-2 gap-4">
                        {images.map((image) => (
                            image && (
                                <Link key={image.id} href={image.slug ? `/product/${image.slug}` : '#'}>
                                    <div className="aspect-w-1 aspect-h-1 block">
                                        <div className="overflow-hidden rounded-lg">
                                            <img
                                                src={image.imageUrl}
                                                alt={image.description || 'Collection image'}
                                                className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
                                                data-ai-hint={image.imageHint}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                    <div className="text-left">
                        <p className="text-sm uppercase tracking-widest text-amber-600">{supertitle}</p>
                        <h2 className="mt-4 font-headline text-5xl text-foreground md:text-6xl">
                            {title}
                        </h2>
                        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                            <Button asChild size="lg" variant="default">
                                <Link href={primaryActionLink}>{primaryActionText}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={secondaryActionLink}>{secondaryActionText}</Link>
                            </Button>
                        </div>
                        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                            {stats.map(stat => (
                                <div key={stat.value}>
                                    <p className="font-headline text-4xl text-amber-600">{stat.value}</p>
                                    <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
