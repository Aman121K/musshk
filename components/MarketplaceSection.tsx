'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function MarketplaceSection() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const marketplaces = [
    {
      name: 'Blinkit',
      logo: '/marketplace-logos/blinkit.svg',
      fallback: (
        <div className="flex items-center">
          <span className="text-2xl font-bold" style={{ color: '#FFC20E' }}>blink</span>
          <span className="text-2xl font-bold" style={{ color: '#10B981' }}>it</span>
        </div>
      ),
      url: '#',
    },
    {
      name: 'Myntra',
      logo: '/marketplace-logos/myntra.svg',
      fallback: (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mr-2">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Myntra</span>
        </div>
      ),
      url: '#',
    },
    {
      name: 'Flipkart',
      logo: '/marketplace-logos/flipkart.svg',
      fallback: (
        <div className="flex items-center">
          <span className="text-xl font-semibold italic" style={{ color: '#2874F0' }}>Flipkart</span>
          <div className="ml-2 w-7 h-7 bg-yellow-400 rounded flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">f</span>
          </div>
        </div>
      ),
      url: '#',
    },
    {
      name: 'Amazon',
      logo: '/marketplace-logos/amazon.svg',
      fallback: (
        <div className="relative inline-flex items-center">
          <span className="text-xl font-semibold text-gray-900">amazon</span>
          <svg 
            className="absolute -bottom-1 left-0 w-full h-3" 
            viewBox="0 0 100 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M 8 10 Q 25 2 42 10 Q 58 18 75 10 Q 85 6 92 10"
              stroke="#FF9900"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ),
      url: '#',
    },
  ];

  const handleImageError = (name: string) => {
    setImageErrors(prev => ({ ...prev, [name]: true }));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-10 tracking-wide">
          WE&apos;RE ALSO AVAILABLE AT
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {marketplaces.map((marketplace, index) => (
            <a
              key={index}
              href={marketplace.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 transform hover:scale-105 min-h-[48px]"
              aria-label={`Available on ${marketplace.name}`}
            >
              {imageErrors[marketplace.name] ? (
                <div className="flex items-center justify-center">
                  {marketplace.fallback}
                </div>
              ) : (
                <div className="relative h-12 w-auto flex items-center justify-center">
                  <Image
                    src={marketplace.logo}
                    alt={`${marketplace.name} logo`}
                    width={120}
                    height={48}
                    className="object-contain max-h-12"
                    onError={() => handleImageError(marketplace.name)}
                    unoptimized
                  />
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
