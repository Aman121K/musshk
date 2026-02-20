'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import { openCartDrawer } from '@/components/CartDrawer';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const sessionId = getSessionId();
    fetchCartCount(sessionId);
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      const currentSessionId = getSessionId();
      fetchCartCount(currentSessionId);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const fetchCartCount = async (sessionId: string) => {
    try {
      const response = await fetch(getApiUrl(`cart/${sessionId}`));
      const cart = await response.json();
      setCartCount(cart.items?.length || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  type SubmenuItem = {
    name: string;
    href: string;
  };

  type MenuItem = {
    name: string;
    href: string;
    submenu?: SubmenuItem[];
  };

  const menuItems: MenuItem[] = [
    { name: 'New Arrival', href: '/new-arrivals' },
    { name: 'Niche Edition', href: '/niche-edition' },
    { 
      name: 'Inspired Perfumes', 
      href: '/inspired-perfumes',
      submenu: [{ name: 'All Inspired', href: '/inspired-perfumes' }]
    },
  ];

  return (
    <header className="bg-white border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Bar - Diptyque-style minimal */}
        <div className="text-aesop-graphite text-center py-2.5 text-[11px] tracking-[0.2em] uppercase font-normal">
          Free shipping across India on all orders.
        </div>

        {/* Main Header - Diptyque editorial */}
        <div className="flex items-center justify-between h-16 md:h-20 border-t border-black/5">
          {/* Logo - tinted with primary for clear visibility on white (CSS mask instead of React Native tintColor) */}
          <Link href="/" className="flex items-center" aria-label="MUSSHK - Where Scent Becomes Legacy">
            <span
              className="block h-14 md:h-16 w-[180px] md:w-[220px] bg-aesop-ink shrink-0"
              style={{
                WebkitMaskImage: 'url(/logo/musshk.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/logo/musshk.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            />
          </Link>

          {/* Desktop Navigation - Diptyque uppercase minimal */}
          <nav className="hidden lg:flex items-center gap-10">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link 
                  href={item.href}
                  className="text-aesop-ink/90 hover:text-aesop-ink font-normal text-[11px] tracking-[0.18em] uppercase transition-colors"
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-black/10 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-sm">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-5 py-2.5 text-xs text-aesop-graphite hover:bg-aesop-cream/50 tracking-wide"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/search" className="text-aesop-graphite hover:text-aesop-ink transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            {user ? (
              <div className="relative group">
                <button className="text-aesop-graphite hover:text-aesop-ink transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-0 w-52 bg-white border border-black/10 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-sm">
                  <div className="px-4 py-2 border-b border-aesop-stone/50">
                    <p className="text-sm font-medium text-aesop-ink">{user.name}</p>
                    <p className="text-xs text-aesop-graphite">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="block w-full text-left px-4 py-2 text-sm text-aesop-graphite hover:bg-aesop-cream"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-aesop-graphite hover:bg-aesop-cream"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-aesop-graphite hover:text-aesop-ink transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative text-aesop-graphite hover:text-aesop-ink transition"
              aria-label={`Cart, ${cartCount} items`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center font-sans">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-aesop-graphite"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-black/5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-aesop-ink text-[11px] tracking-[0.18em] uppercase"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

