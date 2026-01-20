'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], total: 0 });
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

      const response = await fetch(`${API_URL}/api/cart/${sessionId}`);
      const data = await response.json();
      setCart(data);

      if (data.items.length === 0) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (order: any) => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please wait...');
      return;
    }

    try {
      // Create Razorpay order
      const paymentResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cart.total,
          receipt: order.orderNumber,
          notes: {
            orderId: order._id,
            orderNumber: order.orderNumber,
          },
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to initialize payment');
      }

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Musshk',
        description: `Order ${order.orderNumber}`,
        order_id: paymentData.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch(`${API_URL}/api/payment/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            // Clear cart
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
              await fetch(`${API_URL}/api/cart/${sessionId}`, {
                method: 'DELETE',
              });
            }
            router.push(`/order-success?orderId=${order._id}`);
          } else {
            alert('Payment verification failed. Please contact support.');
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
            alert('Payment cancelled. Your order has been placed with COD.');
            router.push(`/order-success?orderId=${order._id}`);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment initialization failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      const orderData = {
        user: user.id, // Link order to user
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
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
        orderStatus: 'Pending',
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();

        if (paymentMethod === 'Online') {
          // Initialize Razorpay payment
          await handleRazorpayPayment(order);
        } else {
          // COD - Clear cart and redirect
          await fetch(`${API_URL}/api/cart/${sessionId}`, {
            method: 'DELETE',
          });
          router.push(`/order-success?orderId=${order._id}`);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
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
    </div>
  );
}

