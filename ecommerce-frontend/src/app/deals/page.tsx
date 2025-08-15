'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productsAPI } from '@/utils/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_name: string;
  stock_quantity: number;
}

export default function Deals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Set fallback demo products for deals page
      const fallbackProducts = [
        {
          id: 1,
          name: 'Demo Smartphone - Special Deal',
          description: 'Amazing smartphone with great features at an unbeatable price!',
          price: '699.99',
          image_url: '',
          category_name: 'Electronics',
          stock_quantity: 10
        },
        {
          id: 2,
          name: 'Demo Laptop - Limited Offer',
          description: 'High-performance laptop perfect for work and gaming.',
          price: '1299.99',
          image_url: '',
          category_name: 'Electronics',
          stock_quantity: 5
        },
        {
          id: 3,
          name: 'Demo Headphones - Flash Sale',
          description: 'Premium wireless headphones with noise cancellation.',
          price: '199.99',
          image_url: '',
          category_name: 'Electronics',
          stock_quantity: 15
        },
        {
          id: 4,
          name: 'Demo T-Shirt - Clearance',
          description: 'Comfortable cotton t-shirt in various colors.',
          price: '29.99',
          image_url: '',
          category_name: 'Clothing',
          stock_quantity: 25
        }
      ];
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountedPrice = (price: string) => {
    const originalPrice = parseFloat(price);
    const discountPercent = Math.floor(Math.random() * 50) + 10; // 10-60% discount
    const discountedPrice = originalPrice * (1 - discountPercent / 100);
    return {
      original: originalPrice,
      discounted: discountedPrice,
      discount: discountPercent
    };
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'electronics': return '📱';
      case 'clothing': return '👕';
      case 'books': return '📚';
      case 'home & garden': return '🏠';
      case 'sports': return '⚽';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">🔥 Hot Deals & Offers</h1>
          <p className="text-xl mb-6">Save up to 60% on selected items</p>
          <div className="flex justify-center space-x-8 text-sm">
            <div className="bg-white bg-opacity-90 text-red-600 px-4 py-2 rounded shadow-lg">
              <div className="font-bold text-2xl">24</div>
              <div className="text-red-500">Hours</div>
            </div>
            <div className="bg-white bg-opacity-90 text-red-600 px-4 py-2 rounded shadow-lg">
              <div className="font-bold text-2xl">15</div>
              <div className="text-red-500">Minutes</div>
            </div>
            <div className="bg-white bg-opacity-90 text-red-600 px-4 py-2 rounded shadow-lg">
              <div className="font-bold text-2xl">30</div>
              <div className="text-red-500">Seconds</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Deal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">⚡ Flash Sale</h3>
            <p className="text-sm opacity-90">Limited time offers</p>
            <div className="text-2xl font-bold mt-2">Up to 50% OFF</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">🎯 Daily Deals</h3>
            <p className="text-sm opacity-90">New deals every day</p>
            <div className="text-2xl font-bold mt-2">Up to 40% OFF</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">🛍️ Bulk Offers</h3>
            <p className="text-sm opacity-90">Buy more, save more</p>
            <div className="text-2xl font-bold mt-2">Up to 60% OFF</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔥 Today&apos;s Best Deals</h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const pricing = getDiscountedPrice(product.price);
            return (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{pricing.discount}%
                </div>

                {/* Wishlist Heart */}
                <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl mb-2">{getCategoryIcon(product.category_name)}</div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">(127)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-800">
                        ${pricing.discounted.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${pricing.original.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                      Save ${(pricing.original - pricing.discounted).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.id}`}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-medium hover:bg-red-600 transition-colors text-center block"
                  >
                    Grab Deal Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔥</div>
            <p className="text-gray-500 text-lg">No deals available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}