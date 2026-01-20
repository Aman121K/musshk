export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: 'Rohit Sharma',
      rating: 5,
      product: 'XP12 Musk Sauvage',
      comment: 'Smells exactly like the luxury brand I always wanted, but at a fraction of the price. People keep asking me what I\'m wearing!',
      date: 'March 10, 2025',
    },
    {
      id: 2,
      name: 'Aarav K.',
      rating: 5,
      product: 'XP21 Musk Av3ntus',
      comment: 'Long-lasting, premium quality, and such elegant packaging. Feels like true luxury every time I wear it.',
      date: 'March 8, 2025',
    },
    {
      id: 3,
      name: 'Simran M.',
      rating: 5,
      product: 'XP126 Musk Flora',
      comment: 'I\'ve tried so many perfumes, but Musk really surprised me — classy fragrances that last all day.',
      date: 'March 5, 2025',
    },
    {
      id: 4,
      name: 'Aniket J.',
      rating: 5,
      product: 'XP35 Musk Cool Water',
      comment: 'The shower gels + perfumes combo is my favorite. Keeps me fresh and confident for hours!',
      date: 'March 3, 2025',
    },
    {
      id: 5,
      name: 'Priya S.',
      rating: 5,
      product: 'XP31 Musk Bombshell',
      comment: 'Absolutely love this fragrance! It\'s become my signature scent. Great value for money.',
      date: 'February 28, 2025',
    },
    {
      id: 6,
      name: 'Rajesh P.',
      rating: 4,
      product: 'XP43 Musk Oud Wood',
      comment: 'Excellent quality perfume. The scent is very close to the original. Highly recommended!',
      date: 'February 25, 2025',
    },
    {
      id: 7,
      name: 'Meera D.',
      rating: 5,
      product: 'XP138 Musk Ombre Leather',
      comment: 'My husband loves this! The packaging is beautiful and the fragrance is amazing. Will definitely order again.',
      date: 'February 20, 2025',
    },
    {
      id: 8,
      name: 'Vikram R.',
      rating: 5,
      product: 'XP01 Musk Sauvage Elixir',
      comment: 'Premium quality at an affordable price. The longevity is impressive. Best purchase I\'ve made!',
      date: 'February 18, 2025',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
      <p className="text-gray-600 mb-12">
        See what our customers are saying about Musshk perfumes.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                <p className="text-sm text-gray-500">{review.product}</p>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
        <p className="text-gray-600 mb-6">
          Have you tried our perfumes? We&apos;d love to hear from you!
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 transition"
        >
          Write a Review
        </a>
      </div>
    </div>
  );
}

