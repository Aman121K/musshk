'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl, API_BASE_URL } from '@/lib/api';

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

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(getApiUrl(`blogs/${params.slug}`));
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found');
        } else {
          throw new Error('Failed to fetch blog post');
        }
        return;
      }
      
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post. Please try again later.');
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error || 'Blog post not found'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchBlog}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
            >
              Try Again
            </button>
            <Link
              href="/blog"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* Blog Image */}
      {blog.image && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={blog.image.startsWith('http') ? blog.image : `${API_BASE_URL}${blog.image}`}
            alt={blog.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        </div>
      )}

      {/* Blog Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-primary-600 uppercase">
            {blog.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(blog.createdAt)}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>
        {blog.excerpt && (
          <p className="text-xl text-gray-600 mb-4">{blog.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By {blog.author}</span>
          {blog.views > 0 && (
            <span>• {blog.views} {blog.views === 1 ? 'view' : 'views'}</span>
          )}
        </div>
      </header>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div
          className="text-gray-700 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
        />
      </article>

      {/* Footer */}
      <div className="border-t pt-8 mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Posts
        </Link>
      </div>
    </div>
  );
}

