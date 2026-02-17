'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('subscribers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && (data.subscribed || data.message)) {
        setSubscribed(true);
        setEmail('');
      } else {
        setError(data.error || 'Subscription failed. Try again.');
      }
    } catch {
      setError('Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-24 text-white bg-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image
              src="/logo/musshk.png"
              alt="MUSSHK - Where Scent Becomes Legacy"
              width={280}
              height={112}
              className="h-24 md:h-28 w-auto brightness-0 invert"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter */}
          <div className="min-w-0">
            <h3 className="font-heading text-base font-medium text-white mb-4 tracking-tight">Unlock Exclusive Offers & Updates</h3>
            <p className="text-gray-400 text-sm mb-4">Exclusive scents, bundles, offers directly to you.</p>
            {subscribed ? (
              <p className="text-primary-300 font-medium text-sm">Thanks for subscribing! We&apos;ll email you when we add new products or blog posts.</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2 w-full">
                <div className="flex w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="flex-1 min-w-0 px-4 py-2.5 bg-white/10 text-white placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-1 focus:ring-white/50 border-0 text-sm disabled:opacity-70"
                  />
                  <button type="submit" disabled={loading} className="bg-white text-black px-5 py-2.5 font-normal text-[11px] tracking-[0.12em] uppercase transition hover:bg-white/90 whitespace-nowrap flex-shrink-0 disabled:opacity-70">
                    {loading ? '...' : 'Subscribe'}
                  </button>
                </div>
                {error && <p className="text-red-300 text-xs">{error}</p>}
              </form>
            )}
          </div>

          {/* Shop now */}
          <div className="min-w-0">
            <h3 className="font-heading text-[11px] font-medium text-white/90 mb-4 tracking-[0.15em] uppercase">Shop now</h3>
            <ul className="space-y-2.5">
              <li><Link href="/best-seller" className="text-gray-400 hover:text-white transition text-sm">Best Sellers</Link></li>
              <li><Link href="/for-him" className="text-gray-400 hover:text-white transition text-sm">For Him</Link></li>
              <li><Link href="/for-her" className="text-gray-400 hover:text-white transition text-sm">For Her</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="min-w-0">
            <h3 className="font-heading text-[11px] font-medium text-white/90 mb-4 tracking-[0.15em] uppercase">About Us</h3>
            <ul className="space-y-2.5">
              <li><Link href="/our-story" className="text-gray-400 hover:text-white transition text-sm">Our Story</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">Our Blog</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-white transition text-sm">Reviews</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="font-heading text-[11px] font-medium text-white/90 mb-4 tracking-[0.15em] uppercase">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/track-order" className="text-gray-400 hover:text-white transition text-sm">Track Your Order</Link></li>
              <li><Link href="/faqs" className="text-gray-400 hover:text-white transition text-sm">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition text-sm">Privacy policy</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-white transition text-sm">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white transition text-sm">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60 text-[11px] tracking-wide uppercase">
          <p>© 2026 Musshk™ All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

