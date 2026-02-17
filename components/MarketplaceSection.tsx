'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getApiUrl, getImageUrl } from '@/lib/api';

interface Marketplace {
  _id: string;
  name: string;
  logo: string;
  url: string;
  order: number;
  isActive: boolean;
}

export default function MarketplaceSection() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMarketplaces = async () => {
      try {
        const res = await fetch(getApiUrl('marketplaces'));
        if (!res.ok) {
          console.warn('[MarketplaceSection] API returned', res.status, res.statusText);
          setMarketplaces([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setMarketplaces(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('[MarketplaceSection] Failed to load marketplaces:', e);
        setMarketplaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplaces();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#f7f5f3] border-t border-black/5 content-visibility-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-center text-aesop-ink mb-12 tracking-[0.12em] uppercase">
            We&apos;re also available at
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 min-h-[60px]" />
        </div>
      </section>
    );
  }

  if (marketplaces.length === 0) return null;

  return (
    <section className="py-20 bg-[#f7f5f3] border-t border-black/5 content-visibility-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-center text-aesop-ink mb-12 tracking-[0.12em] uppercase">
          We&apos;re also available at
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {marketplaces.map((marketplace) => {
            const logoSrc = marketplace.logo ? getImageUrl(marketplace.logo) : '';
            const showTextOnly = imageErrors[marketplace._id] || !logoSrc;
            return (
              <a
                key={marketplace._id}
                href={marketplace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 transform hover:scale-105 min-h-[48px]"
                aria-label={`Available on ${marketplace.name}`}
              >
                {showTextOnly ? (
                  <span className="text-lg font-semibold text-gray-700">{marketplace.name}</span>
                ) : (
                  <div className="relative h-12 w-auto flex items-center justify-center min-w-[100px]">
                    <Image
                      src={logoSrc}
                      alt={`${marketplace.name} logo`}
                      width={120}
                      height={48}
                      className="object-contain max-h-12 w-auto"
                      onError={() => setImageErrors((prev) => ({ ...prev, [marketplace._id]: true }))}
                      unoptimized={logoSrc.startsWith('http')}
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
