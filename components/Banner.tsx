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

  // Reserve space to avoid layout shift (CLS): same aspect ratio as banner
  if (loading) {
    return <div className="w-full min-h-[180px] sm:min-h-[240px] bg-gray-100" aria-hidden />;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {banners.map((banner) => (
        <Link
          key={banner._id}
          href={banner.link || '#'}
          className="block w-full relative group"
        >
          <div className="relative w-full aspect-[32/10] min-h-[180px] sm:min-h-[240px] overflow-hidden bg-gray-100">
            <Image
              src={banner.image?.startsWith('http') ? banner.image : getImageUrl(banner.image)}
              alt={banner.title || 'Banner'}
              fill
              sizes="100vw"
              quality={80}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
