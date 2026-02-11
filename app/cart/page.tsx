'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';
import { getSessionId } from '@/lib/session';

interface CartItem {
  productId: string;
  id?: string; // MongoDB _id of the cart item for identification
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface Cart {
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = getSessionId();

      const response = await fetch(getApiUrl(`cart/${sessionId}`));
      const data = await response.json();
      
      // Ensure productId is always a string - handle MongoDB ObjectId
      // Also extract item _id for identification
      if (data.items && Array.isArray(data.items)) {
        data.items = data.items.map((item: any) => {
          let productIdStr = '';
          let itemIdStr = '';
          
          if (item.productId) {
            // Backend may return populated productId as { _id, name, images }; use _id to avoid "[object Object]"
            if (typeof item.productId === 'object' && item.productId._id != null) {
              productIdStr = String(item.productId._id);
            } else if (typeof item.productId === 'object' && typeof item.productId.toString === 'function') {
              const s = item.productId.toString();
              productIdStr = s.startsWith('[object') ? '' : s;
            }
            if (!productIdStr) productIdStr = String(item.productId);
          }
          
          // Extract item _id if it exists
          if (item._id) {
            if (typeof item._id === 'object' && item._id.toString) {
              itemIdStr = item._id.toString();
            } else {
              itemIdStr = String(item._id);
            }
          }
          
          return {
            ...item,
            productId: productIdStr,
            id: itemIdStr || productIdStr, // Use item _id if available, fallback to productId
          };
        });
      }
      
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string | any, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const sessionId = getSessionId();

      // Ensure productId is a string - handle object case
      let productIdStr = '';
      if (productId) {
        if (typeof productId === 'object' && productId.toString) {
          productIdStr = productId.toString();
        } else if (typeof productId === 'object' && productId._id) {
          productIdStr = String(productId._id);
        } else {
          productIdStr = String(productId);
        }
      }
      
      if (!productIdStr) {
        console.error('Invalid productId:', productId);
        return;
      }

      await fetch(getApiUrl(`cart/${sessionId}/${productIdStr}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      await fetchCart();
      // Update header cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId: string | any) => {
    try {
      const sessionId = getSessionId();

      // Ensure productId is a string - handle object case
      let productIdStr = '';
      if (productId) {
        if (typeof productId === 'object' && productId.toString) {
          productIdStr = productId.toString();
        } else if (typeof productId === 'object' && productId._id) {
          productIdStr = String(productId._id);
        } else {
          productIdStr = String(productId);
        }
      }
      
      if (!productIdStr) {
        console.error('Invalid productId:', productId);
        return;
      }

      const apiUrl = getApiUrl(`cart/${sessionId}/${productIdStr}`);
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productIdStr,
          id: productIdStr, // Also send as id for backend flexibility
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error removing item:', errorData.error || 'Failed to remove item');
        return;
      }

      await fetchCart();
      // Update header cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => {
              // productId is already normalized to string in fetchCart
              const productId = item.productId || item.id || '';
              
              if (!productId) {
                console.error('Invalid productId in cart item:', item);
                return null;
              }
              
              return (
              <div
                key={productId}
                className="bg-white border rounded-lg p-4 flex items-center space-x-4"
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image.startsWith('http') ? item.image : getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.size && (
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  )}
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    Rs. {item.price.toFixed(2)} {item.size && <span className="text-sm font-normal text-gray-500">/ {item.size}</span>}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(productId, item.quantity - 1)}
                      className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(productId, item.quantity + 1)}
                      className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id || productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">Rs. {cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Rs. {cart.total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition font-semibold"
            >
              Proceed to Checkout
            </Link>
            <p className="text-xs text-gray-500 text-center mt-2">
              You&apos;ll need to login or register to complete your purchase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

