'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';
import { getSessionId } from '@/lib/visitorTracking';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/checkout';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const sessionId = getSessionId();
      const response = await fetch(getApiUrl('auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to checkout or home
        router.push(redirectTo);
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-block" aria-label="MUSSHK - Where Scent Becomes Legacy">
            <span
              className="block h-24 md:h-28 w-[240px] md:w-[280px] bg-primary-600 shrink-0"
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
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">Login</h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to your account to continue
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-lg transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-primary-600 hover:underline font-semibold"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

