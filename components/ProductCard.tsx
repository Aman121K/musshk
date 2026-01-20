'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  code: string;
  price: number;
  originalPrice?: number;
  images: string[];
  soldOut: boolean;
  rating: number;
  reviewCount: number;
  sizes?: Array<{ size: string; price: number; stock: number }>;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    checkCartQuantity();
    // Listen for cart updates
    const handleCartUpdate = () => {
      checkCartQuantity();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [product._id]);

  const checkCartQuantity = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setCartQuantity(0);
        return;
      }

      const response = await fetch(`${API_URL}/api/cart/${sessionId}`);
      const cart = await response.json();
      const cartItem = cart.items?.find((item: any) => item.productId === product._id);
      setCartQuantity(cartItem?.quantity || 0);
    } catch (error) {
      console.error('Error checking cart:', error);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const sessionId = localStorage.getItem('sessionId') || 'session_' + Date.now();
      localStorage.setItem('sessionId', sessionId);

      const response = await fetch(`${API_URL}/api/cart/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          size: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '100 ml',
          price: product.sizes && product.sizes.length > 0 ? product.sizes[0].price : product.price,
          quantity: 1,
          image: product.images[0] || '',
        }),
      });

      if (response.ok) {
        setCartQuantity(1);
        // Dispatch event to update cart count in header immediately
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (newQuantity < 1) {
      handleRemoveFromCart(e);
      return;
    }

    setIsUpdating(true);

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      const response = await fetch(`${API_URL}/api/cart/${sessionId}/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        setCartQuantity(newQuantity);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      const response = await fetch(`${API_URL}/api/cart/${sessionId}/${product._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartQuantity(0);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <Link href={`/products/${product.slug}`} className="block">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300">
                <span className="text-4xl">✨</span>
              </div>
            )}
            {product.soldOut && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Sold Out
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
              {product.name}
            </h3>

            {/* Reviews */}
            {product.reviewCount > 0 && (
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">{product.reviewCount} reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg font-bold text-gray-900">Rs. {product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  Rs. {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Add to Cart Button or Quantity Controls */}
        <div className="px-4 pb-4">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                disabled={product.soldOut || isUpdating}
                className={`w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-50 transition ${
                  product.soldOut || isUpdating
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              >
                -
              </button>
              <span className="text-lg font-semibold min-w-[2rem] text-center">
                {isUpdating ? '...' : cartQuantity}
              </span>
              <button
                onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                disabled={product.soldOut || isUpdating}
                className={`w-10 h-10 border rounded-md flex items-center justify-center hover:bg-gray-50 transition ${
                  product.soldOut || isUpdating
                    ? 'bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.soldOut || isAdding}
              className={`w-full py-2 rounded-md font-semibold transition ${
                product.soldOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isAdding ? 'Adding...' : product.soldOut ? 'Sold Out' : 'Add to cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

