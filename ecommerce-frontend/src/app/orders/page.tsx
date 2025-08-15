'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/utils/api';
import { useToast } from '@/contexts/ToastContext';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}

interface Order {
  id: number;
  status: string;
  total_amount: string;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showError } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [router, fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': 
        return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200';
      case 'processing': 
        return 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-800 border border-sky-200';
      case 'shipped': 
        return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200';
      case 'delivered': 
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200';
      case 'cancelled': 
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200';
      default: 
        return 'bg-gradient-to-r from-neutral-100 to-gray-100 text-neutral-800 border border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-neutral-700">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-sky-50 to-emerald-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Your Orders</h1>
          <p className="text-neutral-600 text-lg">Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">No Orders Yet</h2>
            <p className="text-neutral-600 text-lg mb-8 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-sky-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{getStatusIcon(order.status)}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">Order #{order.id}</h2>
                      <p className="text-neutral-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end space-y-2">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                      ${order.total_amount}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gradient-to-r from-neutral-50 to-sky-50/30 rounded-2xl p-4 mb-6">
                  <h3 className="font-bold text-neutral-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Items ({order.items.length})
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-sky-100/50 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">📦</span>
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900">{item.product_name}</span>
                            <div className="text-sm text-neutral-600">Qty: {item.quantity} × ${item.price}</div>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900">${item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gradient-to-r from-emerald-50 to-orange-50/30 rounded-2xl p-4">
                  <h3 className="font-bold text-neutral-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Shipping Address
                  </h3>
                  <div className="bg-white rounded-lg p-3 border border-emerald-100/50">
                    <p className="text-neutral-700 whitespace-pre-line">{order.shipping_address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}