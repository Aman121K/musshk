'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl, API_BASE_URL, getImageUrl } from '@/lib/api';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  author: string;
  published: boolean;
  featured: boolean;
  tags?: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    console.log('Fetching blogs from:', API_BASE_URL);
    try {
      setLoading(true);
      setError('');
      // Fetch only published blogs
      const apiUrl = getApiUrl('blogs?published=true');
      console.log('Fetching blogs from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Blog API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Blog API Error Response:', errorText);
        throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Blog API Data received:', data);
      setBlogPosts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      setError(`Failed to load blog posts: ${error.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
      <p className="text-gray-600 mb-12">
        Discover the latest trends, tips, and insights about perfumes and fragrances.
      </p>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No blog posts available at the moment.</p>
          <p className="text-gray-500 text-sm">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post._id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.image ? (
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={post.image.startsWith('http') ? post.image : getImageUrl(post.image)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary-600 uppercase">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition"
                  >
                    Read More →
                  </Link>
                  {post.views > 0 && (
                    <span className="text-xs text-gray-500">
                      {post.views} {post.views === 1 ? 'view' : 'views'}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

