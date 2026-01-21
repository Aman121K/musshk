'use client';

import { useState } from 'react';
import { getApiUrl } from '@/lib/api';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(getApiUrl(`orders?orderNumber=${orderNumber}`));
      
      if (response.ok) {
        const data = await response.json();
        const foundOrder = data.find((o: any) => o.orderNumber === orderNumber);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found. Please check your order number.');
        }
      } else {
        setError('Unable to track order. Please try again later.');
      }
    } catch (err) {
      setError('Unable to track order. Please try again later.');
    } finally {
      setLoading(false);
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
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
      <p className="text-gray-600 mb-8">
        Enter your order number to track the status of your shipment.
      </p>

      <div className="bg-white border rounded-lg p-8 mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter your order number (e.g., ORD123456)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
      </div>

      {order && (
        <div className="bg-white border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Order Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-semibold">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                <p className="font-semibold">{order.trackingNumber}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="font-semibold text-lg">Rs. {order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <p className="text-gray-700">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} ({item.size}) x {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">
          If you have any questions about your order, please contact our customer support team.
        </p>
        <a
          href="/contact"
          className="text-primary-600 font-semibold hover:text-primary-700"
        >
          Contact Support →
        </a>
      </div>
    </div>
  );
}

