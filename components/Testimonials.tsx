'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
      const response = await fetch(`${API_URL}/api/testimonials?featured=true`);
      const data = await response.json();
      setTestimonials(data.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback to default testimonials
      setTestimonials([
        {
          _id: '1',
          name: 'Rohit Sharma',
          rating: 5,
          comment: 'Smells exactly like the luxury brand I always wanted, but at a fraction of the price. People keep asking me what I\'m wearing!',
        },
        {
          _id: '2',
          name: 'Aarav K.',
          rating: 5,
          comment: 'Long-lasting, premium quality, and such elegant packaging. Feels like true luxury every time I wear it.',
        },
        {
          _id: '3',
          name: 'Simran M.',
          rating: 5,
          comment: 'I\'ve tried so many perfumes, but Musshk really surprised me — classy fragrances that last all day.',
        },
        {
          _id: '4',
          name: 'Aniket J.',
          rating: 5,
          comment: 'The shower gels + perfumes combo is my favorite. Keeps me fresh and confident for hours!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Fragrances That Leave a Mark</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {testimonial.image ? (
                    <img
                      src={`${API_URL}${testimonial.image}`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-600 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    {testimonial.product && (
                      <p className="text-xs text-gray-500">{testimonial.product}</p>
                    )}
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-2">
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
                <p className="text-gray-600 italic">&quot;{testimonial.comment}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

