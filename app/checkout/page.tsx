'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>({ items: [], total: 0, _id: null });
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const { showModal, ModalComponent } = useModal();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // User not logged in, redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      // Pre-fill form with user data if available
      setFormData(prev => ({
        ...prev,
        name: userObj.name || prev.name,
        email: userObj.email || prev.email,
        phone: userObj.phone || prev.phone,
      }));

      // Fetch cart after auth check
      fetchCart();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth && user) {
      fetchCart();
    }
  }, [checkingAuth, user]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        router.push('/cart');
        return;
      }

      const response = await fetch(getApiUrl(`cart/${sessionId}`));
      const data = await response.json();
      setCart(data);
      
      // If cart doesn't have _id, it's from old in-memory system
      if (!data._id && data.items && data.items.length > 0) {
        // Migrate to database - this is a fallback
        console.warn('Cart not in database, may need migration');
      }

      if (data.items.length === 0) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (cartId: string) => {
    if (!razorpayLoaded) {
      showToast('Payment gateway is loading. Please wait...', 'info');
      return;
    }

    try {
      // Create Razorpay order with cartId in notes
      const paymentResponse = await fetch(getApiUrl('payment/create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cart.total,
          receipt: `cart_${cartId}`,
          cartId: cartId,
          notes: {
            cartId: cartId,
          },
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        const errorMessage = paymentData.error || 'Failed to initialize payment';
        showModal(
          errorMessage,
          { 
            type: 'error', 
            title: 'Payment Error',
            confirmText: 'OK'
          }
        );
        setSubmitting(false);
        return;
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Musshk',
        description: `Cart ${cartId.slice(-8)}`,
        order_id: paymentData.id,
        handler: async function (response: any) {
          // Verify payment (webhook will handle order creation, but we verify here too)
          const verifyResponse = await fetch(getApiUrl('payment/verify-payment'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartId: cart._id,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            // Clear cart (it's now converted to order)
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
              await fetch(getApiUrl(`cart/${sessionId}`), {
                method: 'DELETE',
              });
            }
            // Dispatch cart update event
            window.dispatchEvent(new Event('cartUpdated'));
            
            // Redirect to order success page
            if (verifyData.orderId) {
              router.push(`/order-success?orderId=${verifyData.orderId}`);
            } else {
              // Wait a moment for webhook to process, then redirect
              setTimeout(() => {
                router.push(`/account`);
              }, 2000);
            }
          } else {
            showModal(
              'Payment verification failed. Please contact support. The webhook will process your payment.',
              { type: 'warning', title: 'Payment Verification' }
            );
            // Still redirect to account page - webhook will handle it
            setTimeout(() => {
              router.push(`/account`);
            }, 2000);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#5e2751',
        },
        modal: {
          ondismiss: function() {
            // Payment cancelled - cart remains pending for potential discount campaigns
            showModal(
              'Payment cancelled. Your cart is saved. You can try again later or contact support for assistance.',
              { type: 'info', title: 'Payment Cancelled' }
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      // Handle Razorpay errors
      razorpay.on('payment.failed', function (response: any) {
        showModal(
          `Payment failed: ${response.error.description || 'Please try again or contact support.'}`,
          { type: 'error', title: 'Payment Failed' }
        );
        setSubmitting(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'Payment initialization failed. Please try again.';
      
      // Check if it's a configuration error
      if (errorMessage.includes('not configured') || errorMessage.includes('RAZORPAY')) {
        showModal(
          errorMessage,
          { 
            type: 'error', 
            title: 'Payment Gateway Error',
            confirmText: 'OK'
          }
        );
      } else {
        showToast(errorMessage, 'error');
      }
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      // Check if cart has items
      if (!cart.items || cart.items.length === 0) {
        showModal(
          'Cart is empty. Please add items to cart first.',
          { type: 'warning', title: 'Cart Empty' }
        );
        setTimeout(() => router.push('/cart'), 2000);
        return;
      }

      // If cart has items but no _id, it means it's not saved to database yet
      // This shouldn't happen with the new system, but handle it gracefully
      if (!cart._id) {
        showModal(
          'Cart not properly initialized. Please try adding items to cart again.',
          { type: 'error', title: 'Cart Error' }
        );
        setTimeout(() => router.push('/cart'), 2000);
        return;
      }

      // Update cart with checkout information
      const checkoutResponse = await fetch(getApiUrl(`cart/${sessionId}/checkout`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: formData,
          paymentMethod: paymentMethod,
          userId: user.id,
        }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        showToast(errorData.error || 'Failed to update cart. Please try again.', 'error');
        setSubmitting(false);
        return;
      }

      const updatedCart = await checkoutResponse.json();

      if (paymentMethod === 'Online') {
        // Initialize Razorpay payment with cartId
        await handleRazorpayPayment(updatedCart._id);
      } else {
        // COD - Convert cart to order immediately
        const orderResponse = await fetch(getApiUrl('orders'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user.id,
            items: cart.items.map((item: any) => ({
              product: item.productId,
              name: item.name,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: cart.total,
            email: formData.email,
            shippingAddress: formData,
            paymentMethod: 'COD',
            paymentStatus: 'Pending',
            orderStatus: 'Processing',
          }),
        });

        if (orderResponse.ok) {
          const order = await orderResponse.json();
          
          // Update cart status to converted
          await fetch(getApiUrl(`cart/${sessionId}`), {
            method: 'DELETE',
          });
          
          // Dispatch cart update event
          window.dispatchEvent(new Event('cartUpdated'));
          
          router.push(`/order-success?orderId=${order._id}`);
        } else {
          const errorData = await orderResponse.json();
          showToast(errorData.error || 'Failed to create order. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      showToast('Failed to process checkout. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="+91 1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-2 mb-4">
              {cart.items.map((item: any) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} ({item.size}) x {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>Rs. {cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>Rs. {cart.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Online')}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Cash on Delivery (COD)</span>
                    <p className="text-xs text-gray-500">Pay when you receive</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentMethod === 'Online'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'Online')}
                    className="mr-3"
                  />
                  <div>
                    <span className="font-medium">Online Payment</span>
                    <p className="text-xs text-gray-500">Pay securely with Razorpay</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="mb-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You will receive an order confirmation email after placing your order.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting || (paymentMethod === 'Online' && !razorpayLoaded)}
              className={`w-full py-3 rounded-md font-semibold text-lg transition ${
                submitting || (paymentMethod === 'Online' && !razorpayLoaded)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {submitting 
                ? 'Processing...' 
                : paymentMethod === 'Online' 
                  ? 'Proceed to Payment' 
                  : 'Place Order (COD)'}
            </button>
          </div>
        </div>
      </form>

      <ToastComponent />
      <ModalComponent />
    </div>
  );
}

