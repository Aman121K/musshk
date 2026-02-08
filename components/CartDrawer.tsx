'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getApiUrl, getImageUrl } from '@/lib/api';
import { getSessionId } from '@/lib/session';

interface CartItem {
  productId: string;
  id?: string;
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

const EVENT_OPEN_CART = 'openCartDrawer';

export function openCartDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT_OPEN_CART));
  }
}

function normalizeCartItems(data: any): Cart {
  if (!data.items || !Array.isArray(data.items)) {
    return { items: [], total: data.total || 0 };
  }
  const items = data.items.map((item: any) => {
    let productIdStr = '';
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
    let itemIdStr = '';
    if (item._id) {
      itemIdStr = typeof item._id === 'object' && item._id.toString ? item._id.toString() : String(item._id);
    }
    return {
      ...item,
      productId: productIdStr,
      id: itemIdStr || productIdStr,
    };
  });
  return { items, total: data.total ?? items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0) };
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    const sessionId = getSessionId();
    try {
      const res = await fetch(getApiUrl(`cart/${sessionId}`));
      const data = await res.json();
      setCart(normalizeCartItems(data));
    } catch {
      setCart({ items: [], total: 0 });
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setLoading(true);
      fetchCart().finally(() => setLoading(false));
    };
    window.addEventListener(EVENT_OPEN_CART, handleOpen);
    return () => window.removeEventListener(EVENT_OPEN_CART, handleOpen);
  }, [fetchCart]);

  useEffect(() => {
    if (!isOpen) return;
    const handleCartUpdated = () => {
      setLoading(true);
      fetchCart().finally(() => setLoading(false));
    };
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, [isOpen, fetchCart]);

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!productId) return;
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    const sessionId = getSessionId();
    setUpdatingId(productId);
    try {
      const res = await fetch(getApiUrl(`cart/${sessionId}/${productId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Update quantity failed', res.status, err);
        return;
      }
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error('Error updating quantity:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId: string) => {
    if (!productId) return;
    const sessionId = getSessionId();
    setUpdatingId(productId);
    try {
      const res = await fetch(getApiUrl(`cart/${sessionId}/${productId}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, id: productId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Remove item failed', res.status, err);
        return;
      }
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error('Error removing item:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && cart.items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : cart.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-600 font-medium hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => {
                const productId = item.productId || item.id || '';
                const imgSrc = item.image ? (item.image.startsWith('http') ? item.image : getImageUrl(item.image)) : '';
                return (
                  <li key={productId} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      {item.size && <p className="text-sm text-gray-500">{item.size}</p>}
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, item.quantity - 1)}
                          disabled={updatingId === productId}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, item.quantity + 1)}
                          disabled={updatingId === productId}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(productId)}
                          disabled={updatingId === productId}
                          className="ml-2 text-red-500 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Subtotal</span>
              <span>Rs. {cart.total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="block text-center text-primary-600 font-medium text-sm mt-2 hover:underline"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
