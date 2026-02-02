'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push(`/login?redirect=${encodeURIComponent('/account')}`);
      return;
    }

    try {
      const userObj = JSON.parse(userData);
      setUser(userObj);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push(`/login?redirect=${encodeURIComponent('/account')}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!user?.id) return;

      const response = await fetch(getApiUrl(`orders/user/${user.id}`));
      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile
          </button>
        </nav>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Order History</h2>
          {orders.length === 0 ? (
            <div className="bg-white border rounded-lg p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition font-semibold"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold mb-2">Rs. {order.totalAmount.toFixed(2)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                      <p className="text-sm font-medium">{order.paymentMethod}</p>
                    </div>
                    {order.paymentDetails?.razorpay_payment_id && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                        <p className="text-sm font-mono">{order.paymentDetails.razorpay_payment_id}</p>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                        <p className="text-sm font-medium">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} {item.size && `(${item.size})`} x {item.quantity}
                          </span>
                          <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress?.name}<br />
                      {order.shippingAddress?.address}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br />
                      {order.shippingAddress?.country}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/track-order?orderNumber=${order.orderNumber}`}
                      className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Track Order
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/order-success?orderId=${order._id}`}
                      className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{user.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <p className="text-gray-900">{user.email || 'N/A'}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
