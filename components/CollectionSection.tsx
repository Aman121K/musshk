'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';

const collections: { name: string; href: string; queries: string[] }[] = [
  { name: 'Best Seller', href: '/best-seller', queries: ['bestSeller=true&limit=1', 'collection=Best%20Seller&limit=1'] },
  { name: 'Niche Edition', href: '/niche-edition', queries: ['collection=Niche%20Edition&limit=1'] },
  { name: 'Inspired Perfumes', href: '/inspired-perfumes', queries: ['collection=Inspired%20Perfumes&limit=1'] },
  { name: 'New Arrivals', href: '/new-arrivals', queries: ['newArrival=true&limit=1', 'collection=New%20Arrivals&limit=1'] },
];

export default function CollectionSection() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const next: Record<string, string> = {};
      for (const col of collections) {
        for (const query of col.queries) {
          try {
            const res = await fetch(getApiUrl(`products?${query}`));
            const data = await res.json();
            const product = data.products?.[0];
            const src = product?.images?.[0];
            if (src) {
              next[col.name] = getImageUrl(src);
              break;
            }
          } catch {
            // try next query
          }
        }
      }
      // Last resort: any collection still missing image gets a product with image from general fetch
      const missing = collections.filter((c) => !next[c.name]);
      if (missing.length > 0) {
        try {
          const res = await fetch(getApiUrl('products?limit=20'));
          const data = await res.json();
          const products = (data.products || []).filter((p: { images?: string[] }) => p?.images?.[0]);
          missing.forEach((col, i) => {
            const product = products[i];
            if (product?.images?.[0]) next[col.name] = getImageUrl(product.images[0]);
          });
        } catch {
          // ignore
        }
      }
      setImages((prev) => ({ ...prev, ...next }));
    };
    fetchImages();
  }, []);

  return (
    <section className="py-20 md:py-24 bg-[#f7f5f3] content-visibility-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-aesop-ink text-center mb-14 tracking-tight">Our Exclusive Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {collections.map((collection) => {
            const imageUrl = images[collection.name];
            const showPlaceholder = !imageUrl || failed[collection.name];
            return (
              <Link
                key={collection.name}
                href={collection.href}
                className="group relative overflow-hidden bg-white transition-opacity hover:opacity-95"
              >
                <div className="aspect-square bg-[#f5f3f0] relative overflow-hidden">
                  {imageUrl && !failed[collection.name] && (
                    <Image
                      src={imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={80}
                      unoptimized={imageUrl.startsWith('http://localhost')}
                      onError={() => setFailed((f) => ({ ...f, [collection.name]: true }))}
                    />
                  )}
                  {showPlaceholder && (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading font-medium text-aesop-ink text-base group-hover:opacity-80 transition">
                    {collection.name}
                  </h3>
                  <p className="text-[11px] text-aesop-graphite mt-2 tracking-[0.12em] uppercase">Explore</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

