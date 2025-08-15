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

export default function WhatsNew() {
       const [products, setProducts] = useState<Product[]>([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
              fetchProducts();
       }, []);

       const fetchProducts = async () => {
              try {
                     const response = await productsAPI.getAll();
                     // Simulate "new" products by shuffling and taking first few
                     const shuffled = response.data.sort(() => 0.5 - Math.random());
                     setProducts(shuffled);
              } catch (error) {
                     console.error('Error fetching products:', error);
                     // Set fallback demo products for What's New page
                     const fallbackProducts = [
                            {
                                   id: 1,
                                   name: 'Latest Smartphone Pro',
                                   description: 'Brand new flagship smartphone with cutting-edge features and amazing camera.',
                                   price: '899.99',
                                   image_url: '',
                                   category_name: 'Electronics',
                                   stock_quantity: 12
                            },
                            {
                                   id: 2,
                                   name: 'Wireless Gaming Headset',
                                   description: 'New wireless gaming headset with 7.1 surround sound and RGB lighting.',
                                   price: '149.99',
                                   image_url: '',
                                   category_name: 'Electronics',
                                   stock_quantity: 8
                            },
                            {
                                   id: 3,
                                   name: 'Smart Fitness Watch',
                                   description: 'Latest fitness tracker with heart rate monitoring and GPS.',
                                   price: '249.99',
                                   image_url: '',
                                   category_name: 'Electronics',
                                   stock_quantity: 15
                            },
                            {
                                   id: 4,
                                   name: 'Premium Cotton T-Shirt',
                                   description: 'New collection of premium organic cotton t-shirts in trendy colors.',
                                   price: '39.99',
                                   image_url: '',
                                   category_name: 'Clothing',
                                   stock_quantity: 20
                            },
                            {
                                   id: 5,
                                   name: 'Eco-Friendly Water Bottle',
                                   description: 'New sustainable water bottle made from recycled materials.',
                                   price: '24.99',
                                   image_url: '',
                                   category_name: 'Home & Garden',
                                   stock_quantity: 30
                            },
                            {
                                   id: 6,
                                   name: 'Yoga Mat Pro',
                                   description: 'Professional-grade yoga mat with superior grip and cushioning.',
                                   price: '79.99',
                                   image_url: '',
                                   category_name: 'Sports',
                                   stock_quantity: 18
                            }
                     ];
                     setProducts(fallbackProducts);
              } finally {
                     setLoading(false);
              }
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

       const getRandomDate = () => {
              const days = Math.floor(Math.random() * 7) + 1;
              return `${days} day${days > 1 ? 's' : ''} ago`;
       };

       if (loading) {
              return (
                     <div className="min-h-screen flex items-center justify-center">
                            <div className="text-xl">Loading new products...</div>
                     </div>
              );
       }

       return (
              <div className="min-h-screen bg-gray-50">
                     {/* Hero Banner */}
                     <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-16">
                            <div className="max-w-7xl mx-auto px-4 text-center">
                                   <h1 className="text-4xl font-bold mb-4">✨ What&apos;s New</h1>
                                   <p className="text-xl mb-6">Discover the latest products and trends</p>
                                   <div className="flex justify-center space-x-8 text-sm">
                                          <div className="bg-white bg-opacity-90 text-purple-600 px-4 py-2 rounded shadow-lg">
                                                 <div className="font-bold text-lg">New Arrivals</div>
                                                 <div className="text-purple-500">This Week</div>
                                          </div>
                                          <div className="bg-white bg-opacity-90 text-purple-600 px-4 py-2 rounded shadow-lg">
                                                 <div className="font-bold text-lg">Trending</div>
                                                 <div className="text-purple-500">Products</div>
                                          </div>
                                          <div className="bg-white bg-opacity-90 text-purple-600 px-4 py-2 rounded shadow-lg">
                                                 <div className="font-bold text-lg">Fresh</div>
                                                 <div className="text-purple-500">Collections</div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <div className="max-w-7xl mx-auto px-4 py-8">
                            {/* New Arrival Categories */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                   <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                                          <div className="text-3xl mb-2">📱</div>
                                          <h3 className="font-bold">Tech Gadgets</h3>
                                          <p className="text-sm opacity-90">Latest electronics</p>
                                   </div>
                                   <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                                          <div className="text-3xl mb-2">👕</div>
                                          <h3 className="font-bold">Fashion</h3>
                                          <p className="text-sm opacity-90">Trendy clothing</p>
                                   </div>
                                   <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg text-center">
                                          <div className="text-3xl mb-2">🏠</div>
                                          <h3 className="font-bold">Home & Living</h3>
                                          <p className="text-sm opacity-90">Lifestyle products</p>
                                   </div>
                                   <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                                          <div className="text-3xl mb-2">⚽</div>
                                          <h3 className="font-bold">Sports & Fitness</h3>
                                          <p className="text-sm opacity-90">Active lifestyle</p>
                                   </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                   <h2 className="text-2xl font-bold text-gray-800">🆕 Latest Arrivals</h2>
                                   <div className="flex space-x-2">
                                          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                                                 This Week
                                          </button>
                                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                                 This Month
                                          </button>
                                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                                 All Time
                                          </button>
                                   </div>
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                   {products.map((product, index) => (
                                          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                                                 {/* New Badge */}
                                                 {index < 3 && (
                                                        <div className="absolute top-3 left-3 z-10 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                               NEW
                                                        </div>
                                                 )}

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
                                                        <div className="flex items-center justify-between mb-2">
                                                               <span className="text-xs text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded">
                                                                      Added {getRandomDate()}
                                                               </span>
                                                               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                      {product.category_name}
                                                               </span>
                                                        </div>

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
                                                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                                             </svg>
                                                                      ))}
                                                               </div>
                                                               <span className="text-sm text-gray-500 ml-1">(New)</span>
                                                        </div>

                                                        <div className="flex items-center justify-between mb-4">
                                                               <span className="text-xl font-bold text-gray-800">
                                                                      ${product.price}
                                                               </span>
                                                               <span className="text-xs text-green-600 font-semibold">
                                                                      In Stock: {product.stock_quantity}
                                                               </span>
                                                        </div>

                                                        <Link
                                                               href={`/product/${product.id}`}
                                                               className="w-full bg-purple-500 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-600 transition-colors text-center block"
                                                        >
                                                               Check It Out
                                                        </Link>
                                                 </div>
                                          </div>
                                   ))}
                            </div>

                            {products.length === 0 && (
                                   <div className="text-center py-12">
                                          <div className="text-6xl mb-4">✨</div>
                                          <p className="text-gray-500 text-lg">No new products available</p>
                                   </div>
                            )}

                            {/* Newsletter Signup */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-8 mt-12 text-center">
                                   <h3 className="text-2xl font-bold mb-4">Stay Updated with New Arrivals</h3>
                                   <p className="mb-6">Be the first to know about our latest products and exclusive offers</p>
                                   <div className="flex max-w-md mx-auto">
                                          <input
                                                 type="email"
                                                 placeholder="Enter your email"
                                                 className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 border-0"
                                          />
                                          <button className="bg-white text-purple-600 px-6 py-2 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
                                                 Subscribe
                                          </button>
                                   </div>
                            </div>
                     </div>
              </div>
       );
}