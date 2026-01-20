export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Perfume Layering: Creating Your Signature Scent',
      excerpt: 'Learn how to layer different fragrances to create a unique scent that represents your personality.',
      date: 'March 15, 2025',
      category: 'Fragrance Tips',
    },
    {
      id: 2,
      title: 'Understanding Fragrance Notes: Top, Middle, and Base',
      excerpt: 'Discover the three layers of fragrance notes and how they work together to create a complete scent experience.',
      date: 'March 10, 2025',
      category: 'Education',
    },
    {
      id: 3,
      title: 'Best Perfumes for Different Seasons',
      excerpt: 'Find out which fragrances work best for spring, summer, fall, and winter to keep you smelling great year-round.',
      date: 'March 5, 2025',
      category: 'Seasonal',
    },
    {
      id: 4,
      title: 'How to Make Your Perfume Last Longer',
      excerpt: 'Simple tips and tricks to extend the longevity of your favorite fragrances throughout the day.',
      date: 'February 28, 2025',
      category: 'Tips & Tricks',
    },
    {
      id: 5,
      title: 'The History of Perfume: From Ancient Times to Modern Day',
      excerpt: 'Take a journey through the fascinating history of perfumery and how it has evolved over centuries.',
      date: 'February 20, 2025',
      category: 'History',
    },
    {
      id: 6,
      title: 'Choosing the Right Perfume for Your Personality',
      excerpt: 'Learn how to select fragrances that match your personality and enhance your natural style.',
      date: 'February 15, 2025',
      category: 'Lifestyle',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
      <p className="text-gray-600 mb-12">
        Discover the latest trends, tips, and insights about perfumes and fragrances.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary-600 uppercase">{post.category}</span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-900">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <a
                href={`/blog/${post.id}`}
                className="text-primary-600 font-semibold hover:text-primary-700 transition"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

