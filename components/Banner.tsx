'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getApiUrl, getImageUrl } from '@/lib/api';

interface Banner {
  _id: string;
  title: string;
  image: string;
  link: string;
  position: string;
  isActive: boolean;
}

interface BannerProps {
  position?: string;
}

const AUTO_ADVANCE_MS = 6000;

export default function Banner({ position = 'home-top' }: BannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, [position]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(getApiUrl('banners'));
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      const filteredBanners = Array.isArray(data)
        ? data.filter((banner: Banner) => banner.position === position && banner.isActive)
        : [];
      setBanners(filteredBanners);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const goTo = useCallback((index: number) => {
    setCurrentIndex((prev) => {
      const len = banners.length;
      if (len === 0) return 0;
      return ((index % len) + len) % len;
    });
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      goTo(currentIndex + 1);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [banners.length, currentIndex, goTo]);

  if (loading) {
    return <div className="w-screen relative left-1/2 -translate-x-1/2 min-h-[220px] sm:min-h-[320px] bg-[#f5f3f0]" aria-hidden />;
  }

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[currentIndex];

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2">
      <Link
        href={banner.link || '#'}
        className="block w-full relative group"
        aria-label={banner.title || 'Banner'}
      >
        <div className="relative w-full aspect-[2/1] min-h-[220px] sm:min-h-[320px] overflow-hidden bg-[#f5f3f0] flex items-center justify-center">
          <Image
            src={banner.image?.startsWith('http') ? banner.image : getImageUrl(banner.image)}
            alt={banner.title || 'Banner'}
            fill
            sizes="100vw"
            quality={80}
            className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </Link>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(currentIndex - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-aesop-ink shadow-md transition"
            aria-label="Previous banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(currentIndex + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-aesop-ink shadow-md transition"
            aria-label="Next banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
                className={`w-2.5 h-2.5 rounded-full transition ${i === currentIndex ? 'bg-white scale-110' : 'bg-white/60 hover:bg-white/80'}`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
