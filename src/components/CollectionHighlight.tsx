
import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { findProductImage } from '@/lib/image-utils';
import { Button } from './ui/button';
import { products as allProducts } from '@/lib/data';
import { useMemo } from 'react';

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

    const images = useMemo(() => imageIds.map(id => {
        const image = findProductImage(id);
        if (!image) return null;
        
        const product = allProducts.find(p => p.images.includes(id));
        return { ...image, slug: product?.slug };
    }).filter(Boolean), [imageIds]);

    return (
        <section className="w-full bg-background py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="grid grid-cols-2 gap-4">
                        {images.map((image) => (
                            image && (
                                <Link key={image.id} href={image.slug ? `/product/${image.slug}` : '#'} className="group" prefetch={true}>
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                                        <Image
                                            src={image.imageUrl}
                                            alt={'description' in image ? image.description : 'Collection image'}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            data-ai-hint={image.imageHint}
                                            onError={(e) => {
                                                console.error(`Failed to load collection image: ${image.imageUrl}`);
                                                e.currentTarget.src = '/images/logo.png';
                                            }}
                                        />
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
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button asChild size="lg" variant="default" className="hover:scale-105 transition-transform duration-300">
                                <Link href={primaryActionLink} prefetch={true}>{primaryActionText}</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="hover:scale-105 transition-transform duration-300">
                                <Link href={secondaryActionLink} prefetch={true}>{secondaryActionText}</Link>
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
