'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';

const FALLBACK_TESTIMONIALS = [
  { _id: '1', name: 'Rohit Sharma', rating: 5, comment: 'Smells exactly like the luxury brand I always wanted, but at a fraction of the price. People keep asking me what I\'m wearing!', product: undefined as string | undefined },
  { _id: '2', name: 'Aarav K.', rating: 5, comment: 'Long-lasting, premium quality, and such elegant packaging. Feels like true luxury every time I wear it.', product: undefined as string | undefined },
  { _id: '3', name: 'Simran M.', rating: 5, comment: 'I\'ve tried so many perfumes, but Musshk really surprised me — classy fragrances that last all day.', product: undefined as string | undefined },
  { _id: '4', name: 'Aniket J.', rating: 5, comment: 'Musshk perfumes are my favorite. Keeps me fresh and confident for hours!', product: undefined as string | undefined },
];

interface Testimonial {
  _id: string;
  name: string;
  product?: string;
  rating: number;
  comment: string;
  image?: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(getApiUrl('testimonials'));
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      const toShow = list.length > 0 ? list.slice(0, 4) : FALLBACK_TESTIMONIALS;
      setTestimonials(toShow);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(FALLBACK_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-20 md:py-24 bg-white content-visibility-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-aesop-ink text-center mb-14 tracking-tight">Fragrances That Leave a Mark</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#f7f5f3] p-8 animate-pulse">
                <div className="h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-[#f7f5f3] p-8 transition-opacity hover:opacity-95"
              >
                <div className="flex items-center mb-4">
                  {testimonial.image ? (
                    <Image
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-600 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading font-medium text-aesop-ink">{testimonial.name}</h4>
                    {testimonial.product && (
                      <p className="text-xs text-aesop-graphite">{testimonial.product}</p>
                    )}
                  </div>
                </div>
                <div className="flex text-amber-700/70 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-aesop-graphite text-sm leading-relaxed">&quot;{testimonial.comment}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

