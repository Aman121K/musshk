'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getApiUrl, getImageUrl } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import { openCartDrawer } from '@/components/CartDrawer';

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

  useEffect(() => {
    // Initial check
    checkCartQuantity();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      // Small delay to ensure cart is updated on server
      setTimeout(() => {
        checkCartQuantity();
      }, 150);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [product._id]);

  const checkCartQuantity = async () => {
    try {
      const sessionId = getSessionId();

      const response = await fetch(getApiUrl(`cart/${sessionId}`));
      const cart = await response.json();
      
      // Normalize productId for comparison (handle both string and ObjectId)
      const productIdStr = String(product._id);
      const cartItem = cart.items?.find((item: any) => {
        const itemProductId = item.productId?.toString ? item.productId.toString() : String(item.productId || '');
        return itemProductId === productIdStr;
      });
      
      setCartQuantity(cartItem?.quantity || 0);
    } catch (error) {
      console.error('Error checking cart:', error);
      setCartQuantity(0);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const sessionId = getSessionId();

      const response = await fetch(getApiUrl(`cart/${sessionId}`), {
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
          image: product.images?.[0] ?? '',
        }),
      });

      if (response.ok) {
        // Immediately set quantity to show controls
        setCartQuantity(1);
        // Verify with actual cart data
        await checkCartQuantity();
        // Dispatch event to update cart count in header
        window.dispatchEvent(new Event('cartUpdated'));
        // Open cart drawer so user sees the item and can proceed to checkout
        openCartDrawer();
      } else {
        const errorData = await response.json();
        console.error('Failed to add to cart:', errorData);
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
      const sessionId = getSessionId();

      const response = await fetch(getApiUrl(`cart/${sessionId}/${product._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        // Optimistically update UI
        setCartQuantity(newQuantity);
        // Verify with actual cart data
        await checkCartQuantity();
        // Dispatch event to update cart count in header
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        // Revert on error
        await checkCartQuantity();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      // Revert on error
      await checkCartQuantity();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);

    try {
      const sessionId = getSessionId();

      const response = await fetch(getApiUrl(`cart/${sessionId}/${product._id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          id: product._id,
        }),
      });

      if (response.ok) {
        // Optimistically update UI
        setCartQuantity(0);
        // Verify with actual cart data
        await checkCartQuantity();
        // Dispatch event to update cart count in header
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        // Revert on error
        await checkCartQuantity();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Revert on error
      await checkCartQuantity();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group">
      <div className="bg-white overflow-hidden transition-opacity hover:opacity-95">
        <Link href={`/products/${product.slug}`} className="block">
          {/* Product Image - Diptyque: image-first, minimal frame */}
          <div className="relative aspect-square bg-[#f5f3f0] overflow-hidden">
            {(() => {
              const imgSrc = product.images?.length ? getImageUrl(product.images[0]) : '';
              if (imgSrc) {
                return (
                  <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    quality={80}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                );
              }
              return (
                <div className="w-full h-full flex items-center justify-center bg-aesop-stone/10">
                  <span className="text-4xl">✨</span>
                </div>
              );
            })()}
            {product.soldOut && (
              <div className="absolute top-3 right-3 bg-black text-white px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] uppercase">
                Sold Out
              </div>
            )}
          </div>

          {/* Product Info - Diptyque editorial: clean, serif headings */}
          <div className="pt-5 pb-4 px-1">
            <h3 className="font-heading font-medium text-aesop-ink text-base mb-1 line-clamp-2 tracking-tight group-hover:opacity-80 transition">
              {product.name}
            </h3>

            {/* Reviews */}
            {product.reviewCount > 0 && (
              <div className="flex items-center mb-3">
                <div className="flex text-amber-700/70">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[11px] text-aesop-graphite ml-2 tracking-wide">{product.reviewCount} reviews</span>
              </div>
            )}

            {/* Price - Diptyque style serif */}
            <div className="flex items-center space-x-2">
              <span className="font-heading text-base font-medium text-aesop-ink">Rs. {product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-aesop-graphite line-through">
                  Rs. {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Add to Cart - Diptyque: "Add to bag" simple black/white */}
        <div className="px-1 pb-5">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-[#f5f3f0] border border-black/10 p-2">
              <button
                onClick={(e) => handleUpdateQuantity(e, cartQuantity - 1)}
                disabled={product.soldOut || isUpdating}
                className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center font-medium transition-all duration-200 ${
                  product.soldOut || isUpdating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:scale-95'
                }`}
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="flex-1 text-center">
                <span className="text-base font-semibold text-gray-900">
                  {isUpdating ? (
                    <span className="inline-block animate-pulse">...</span>
                  ) : (
                    `${cartQuantity} ${cartQuantity === 1 ? 'item' : 'items'} in cart`
                  )}
                </span>
              </div>
              <button
                onClick={(e) => handleUpdateQuantity(e, cartQuantity + 1)}
                disabled={product.soldOut || isUpdating}
                className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center font-medium transition-all duration-200 ${
                  product.soldOut || isUpdating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:scale-95'
                }`}
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.soldOut || isAdding}
              className={`w-full py-3 font-normal text-[11px] tracking-[0.18em] uppercase transition ${
                product.soldOut
                  ? 'bg-gray-200 text-aesop-graphite cursor-not-allowed'
                  : isAdding
                  ? 'bg-black text-white cursor-wait'
                  : 'bg-black text-white hover:bg-aesop-graphite active:scale-[0.99]'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : product.soldOut ? (
                'Sold Out'
              ) : (
                'Add to bag'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

