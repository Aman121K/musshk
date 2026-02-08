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

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <div className="w-full">
      {banners.map((banner) => (
        <Link
          key={banner._id}
          href={banner.link || '#'}
          className="block w-full relative group"
        >
          <div className="relative w-full h-auto overflow-hidden">
            <Image
              src={banner.image?.startsWith('http') ? banner.image : getImageUrl(banner.image)}
              alt={banner.title || 'Banner'}
              width={1920}
              height={600}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              unoptimized
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
