'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Indian States List
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

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
  const [paymentMethod, setPaymentMethod] = useState<'Online'>('Online');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const { showToast, ToastComponent } = useToast();
  const { showModal, ModalComponent } = useModal();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      setFormData(prev => ({
        ...prev,
        name: userObj.name || prev.name,
        email: userObj.email || prev.email,
        phone: userObj.phone || prev.phone,
      }));

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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = getSessionId();

      const response = await fetch(getApiUrl(`cart/${sessionId}`));
      const data = await response.json();

      if (data.items && data.items.length === 0) {
        router.push('/cart');
        return;
      }

      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showToast('Failed to load cart. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const sessionId = getSessionId();
      if (!cart._id) {
        showToast('Cart ID not found. Please try again.', 'error');
        setSubmitting(false);
        return;
      }

      const checkoutResponse = await fetch(getApiUrl(`cart/${sessionId}/checkout`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: formData,
          paymentMethod: 'Online',
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

      if (!updatedCart._id) {
        showToast('Cart ID not found. Please try again.', 'error');
        setSubmitting(false);
        return;
      }

      await handleRazorpayPayment(updatedCart._id);
    } catch (error) {
      console.error('Error during checkout:', error);
      showToast('Something went wrong. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  const handleRazorpayPayment = async (cartId: string) => {
    if (!razorpayLoaded) {
      showToast('Payment gateway is loading. Please wait...', 'info');
      setSubmitting(false);
      return;
    }

    try {
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
          const verifyResponse = await fetch(getApiUrl('payment/verify-payment'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartId: cartId,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            const sessionId = getSessionId();
            await fetch(getApiUrl(`cart/${sessionId}`), {
              method: 'DELETE',
            });
            window.dispatchEvent(new Event('cartUpdated'));
            
            if (verifyData.orderId) {
              router.push(`/order-success?orderId=${verifyData.orderId}`);
            } else {
              setTimeout(() => {
                router.push(`/account`);
              }, 2000);
            }
          } else {
            showModal(
              'Payment verification failed. Please contact support. The webhook will process your payment.',
              { type: 'warning', title: 'Payment Verification' }
            );
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
            setSubmitting(false);
            showToast('Payment cancelled', 'info');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      showModal(
        'Failed to initialize payment gateway. Please try again.',
        { type: 'error', title: 'Payment Error' }
      );
      setSubmitting(false);
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'shipping' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="font-semibold">1</span>
              </div>
              <span className={`ml-2 font-medium ${currentStep === 'shipping' ? 'text-primary-600' : 'text-gray-600'}`}>Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'payment' ? 'bg-primary-600 text-white' : currentStep === 'review' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <span className="font-semibold">2</span>
              </div>
              <span className={`ml-2 font-medium ${currentStep === 'payment' || currentStep === 'review' ? 'text-primary-600' : 'text-gray-600'}`}>Payment</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2">
              {/* Shipping Information Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold ml-3">Shipping Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition resize-none"
                      placeholder="House/Flat No., Building Name, Street"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition bg-white"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                        placeholder="110001"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition bg-gray-50"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item: any) => (
                    <div key={item.productId} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image.startsWith('http') ? item.image : getImageUrl(item.image)}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl">✨</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.size}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>Rs. {cart.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Online Payment</p>
                      <p className="text-xs text-gray-500">Secure payment via Razorpay</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !razorpayLoaded}
                  className={`w-full py-3.5 rounded-md font-semibold text-base transition-all ${
                    submitting || !razorpayLoaded
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {submitting 
                    ? 'Processing...' 
                    : !razorpayLoaded
                      ? 'Loading Payment...'
                      : 'Complete Order'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>

        <ToastComponent />
        <ModalComponent />
      </div>
    </div>
  );
}
