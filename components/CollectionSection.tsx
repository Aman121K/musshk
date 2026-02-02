import Link from 'next/link';

const collections = [
  { name: 'Best Seller', href: '/best-seller', image: '/images/best-seller.jpg' },
  { name: 'Niche Edition', href: '/niche-edition', image: '/images/niche.jpg' },
  { name: 'Inspired Perfumes', href: '/inspired-perfumes', image: '/images/inspired.jpg' },
  { name: 'New Arrivals', href: '/new-arrivals', image: '/images/new.jpg' },
];

export default function CollectionSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Exclusive Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">
                  {collection.name}
                </h3>
                <p className="text-sm text-primary-600 mt-2">Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

