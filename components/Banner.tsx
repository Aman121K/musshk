'use client';

import { useEffect, useState } from 'react';
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

export default function Banner({ position = 'home-top' }: BannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      // Filter banners by position and isActive
      const filteredBanners = Array.isArray(data)
        ? data.filter((banner: Banner) => banner.position === position && banner.isActive)
        : [];
      
      setBanners(filteredBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reserve space to avoid layout shift (CLS): same proportions as banner (2:1)
  if (loading) {
    return <div className="w-screen relative left-1/2 -translate-x-1/2 min-h-[220px] sm:min-h-[320px] bg-[#f5f3f0]" aria-hidden />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2">
      {banners.map((banner) => (
        <Link
          key={banner._id}
          href={banner.link || '#'}
          className="block w-full relative group"
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
      ))}
    </div>
  );
}
