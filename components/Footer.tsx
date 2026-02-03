import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-20 text-white" style={{ backgroundColor: '#1a1a2e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              src="/logo/musshk-logo-white.svg"
              alt="MUSSHK - Where Scent Becomes Legacy"
              width={200}
              height={80}
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter */}
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white mb-4">Unlock Exclusive Offers & Updates from Musshk</h3>
            <p className="text-gray-400 text-sm mb-4">Exclusive scents, bundles, offers directly to you.</p>
            <div className="flex w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-2.5 text-white placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-600 border-0 text-sm"
                style={{ backgroundColor: '#2d2d44' }}
              />
              <button className="bg-primary-600 px-4 py-2.5 rounded-r-md font-semibold text-white transition hover:opacity-90 whitespace-nowrap text-sm flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>

          {/* Shop now */}
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white mb-4">Shop now</h3>
            <ul className="space-y-2.5">
              <li><Link href="/best-sellers" className="text-gray-400 hover:text-white transition text-sm">Best Sellers</Link></li>
              <li><Link href="/for-him" className="text-gray-400 hover:text-white transition text-sm">For Him</Link></li>
              <li><Link href="/for-her" className="text-gray-400 hover:text-white transition text-sm">For Her</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white mb-4">About Us</h3>
            <ul className="space-y-2.5">
              <li><Link href="/our-story" className="text-gray-400 hover:text-white transition text-sm">Our Story</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">Our Blog</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-white transition text-sm">Reviews</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/track-order" className="text-gray-400 hover:text-white transition text-sm">Track Your Order</Link></li>
              <li><Link href="/faqs" className="text-gray-400 hover:text-white transition text-sm">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition text-sm">Privacy policy</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-white transition text-sm">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white transition text-sm">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-400 text-sm" style={{ borderColor: '#2d2d44' }}>
          <p>© 2026 Musshk™ All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

