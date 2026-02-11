'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getApiUrl, getImageUrl } from '@/lib/api';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [failedOrderImage, setFailedOrderImage] = useState<Record<string, boolean>>({});

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
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'pending':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {user.name || 'User'}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Order History</h2>
              {orders.length > 0 && (
                <p className="text-sm text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Order Header */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.orderNumber}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-bold text-gray-900">Rs. {order.totalAmount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 mt-1">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="px-6 py-5">
                      {/* Payment Information */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Payment Status</p>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Payment Method</p>
                          <p className="text-sm font-medium text-gray-900">{order.paymentMethod || 'N/A'}</p>
                        </div>
                        {order.paymentDetails?.razorpay_payment_id && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Payment ID</p>
                            <p className="text-sm font-mono text-gray-900 break-all">{order.paymentDetails.razorpay_payment_id}</p>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Tracking Number</p>
                            <p className="text-sm font-medium text-gray-900">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Items ({order.items.length})</h4>
                        <div className="space-y-3">
                          {order.items.map((item: any, index: number) => {
                            const itemImage = item.image ?? item.product?.images?.[0];
                            return (
                            <div key={item._id ?? index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="relative flex-shrink-0 w-16 h-16 bg-white rounded-md border border-gray-200 overflow-hidden">
                                {itemImage && !failedOrderImage[`${order._id}-${index}`] ? (
                                  <Image
                                    src={typeof itemImage === 'string' && itemImage.startsWith('http') ? itemImage : getImageUrl(itemImage)}
                                    alt={item.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                    loading="lazy"
                                    onError={() => setFailedOrderImage((prev) => ({ ...prev, [`${order._id}-${index}`]: true }))}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <span className="text-2xl">✨</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                  {item.name}
                                </p>
                                {item.size && (
                                  <p className="text-xs text-gray-500 mb-1">Size: {item.size}</p>
                                )}
                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <p className="text-sm font-semibold text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-gray-500">Rs. {item.price.toFixed(2)} each</p>
                                )}
                              </div>
                            </div>
                          );})}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h4>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-900 font-medium mb-1">{order.shippingAddress.name}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {order.shippingAddress.address}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                              {order.shippingAddress.country}
                            </p>
                            {order.shippingAddress.phone && (
                              <p className="text-sm text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/track-order?orderNumber=${order.orderNumber}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Track Order
                        </Link>
                        <Link
                          href={`/order-success?orderId=${order._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                          View Details
                        </Link>
                      </div>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                  <p className="text-base font-medium text-gray-900">{user.name || 'N/A'}</p>
                </div>
                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                  <p className="text-base font-medium text-gray-900">{user.email || 'N/A'}</p>
                </div>
                {user.phone && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
                    <p className="text-base font-medium text-gray-900">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
