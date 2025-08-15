'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/utils/api';

interface Review {
       id: number;
       user_name: string;
       user_first_name: string;
       rating: number;
       title: string;
       comment: string;
       is_verified_purchase: boolean;
       created_at: string;
}

interface Product {
       id: number;
       name: string;
       description: string;
       price: string;
       image_url: string;
       category_name: string;
       stock_quantity: number;
       average_rating?: number;
       review_count?: number;
       rating_distribution?: { [key: number]: number };
       reviews?: Review[];
}

export default function Home() {
       const [products, setProducts] = useState<Product[]>([]);
       const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
       const [loading, setLoading] = useState(true);
       const [currentImageIndex, setCurrentImageIndex] = useState(0);
       const [imageLoading, setImageLoading] = useState(true);
       const [heroProducts, setHeroProducts] = useState<Product[]>([]);

       // Filter states
       const [selectedCategory, setSelectedCategory] = useState<string>('');
       const [priceRange, setPriceRange] = useState<string>('');
       const [sortBy, setSortBy] = useState<string>('relevance');

       // Dynamic hero banner images from actual products
       const getHeroImages = useCallback(() => {
              if (heroProducts.length > 0) {
                     return heroProducts.map((product, index) => ({
                            id: product.id,
                            image: product.image_url,
                            emoji: getProductEmoji(product.category_name),
                            color: getProductColor(index),
                            bgColor: getProductBgColor(index),
                            title: product.name,
                            price: product.price,
                            discount: getRandomDiscount(),
                            category: product.category_name
                     }));
              }

              // Fallback static images
              return [
                     {
                            id: 1,
                            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
                            emoji: '🎧',
                            color: 'from-blue-200 via-blue-300 to-blue-400',
                            bgColor: 'from-blue-300/50 to-purple-400/50',
                            title: 'Premium Headphones',
                            price: '199.99',
                            discount: '40% OFF',
                            category: 'Electronics'
                     },
                     {
                            id: 2,
                            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
                            emoji: '📱',
                            color: 'from-indigo-200 via-indigo-300 to-indigo-400',
                            bgColor: 'from-indigo-300/50 to-purple-400/50',
                            title: 'Latest Smartphone',
                            price: '699.99',
                            discount: '30% OFF',
                            category: 'Electronics'
                     },
                     {
                            id: 3,
                            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
                            emoji: '💻',
                            color: 'from-purple-200 via-purple-300 to-purple-400',
                            bgColor: 'from-purple-300/50 to-pink-400/50',
                            title: 'Gaming Laptop',
                            price: '1299.99',
                            discount: '25% OFF',
                            category: 'Electronics'
                     },
                     {
                            id: 4,
                            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
                            emoji: '⌚',
                            color: 'from-orange-200 via-orange-300 to-orange-400',
                            bgColor: 'from-orange-300/50 to-red-400/50',
                            title: 'Smart Watch',
                            price: '299.99',
                            discount: '50% OFF',
                            category: 'Electronics'
                     },
                     {
                            id: 5,
                            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
                            emoji: '👕',
                            color: 'from-teal-200 via-teal-300 to-teal-400',
                            bgColor: 'from-teal-300/50 to-cyan-400/50',
                            title: 'Premium T-Shirt',
                            price: '29.99',
                            discount: '35% OFF',
                            category: 'Clothing'
                     }
              ];
       }, [heroProducts]);

       const getProductEmoji = (category: string) => {
              switch (category) {
                     case 'Electronics': return '📱';
                     case 'Clothing': return '👕';
                     case 'Books': return '📚';
                     case 'Home & Garden': return '🏠';
                     case 'Sports': return '⚽';
                     default: return '🛍️';
              }
       };

       const getProductColor = (index: number) => {
              const colors = [
                     'from-indigo-200 via-indigo-300 to-indigo-400',
                     'from-slate-200 via-slate-300 to-slate-400',
                     'from-violet-200 via-violet-300 to-violet-400',
                     'from-emerald-200 via-emerald-300 to-emerald-400',
                     'from-cyan-200 via-cyan-300 to-cyan-400',
                     'from-rose-200 via-rose-300 to-rose-400'
              ];
              return colors[index % colors.length];
       };

       const getProductBgColor = (index: number) => {
              const bgColors = [
                     'from-indigo-300/50 to-violet-400/50',
                     'from-slate-300/50 to-gray-400/50',
                     'from-violet-300/50 to-purple-400/50',
                     'from-emerald-300/50 to-teal-400/50',
                     'from-cyan-300/50 to-blue-400/50',
                     'from-rose-300/50 to-pink-400/50'
              ];
              return bgColors[index % bgColors.length];
       };

       const getRandomDiscount = () => {
              const discounts = ['20% OFF', '30% OFF', '40% OFF', '50% OFF', '25% OFF', '35% OFF'];
              return discounts[Math.floor(Math.random() * discounts.length)];
       };

       const heroImages = getHeroImages();

       useEffect(() => {
              fetchProducts();
       }, []);

       // Set up hero products when products are loaded
       useEffect(() => {
              if (products.length > 0) {
                     // Select featured products for hero banner (mix of different categories)
                     const featuredProducts = products.slice(0, 5);
                     setHeroProducts(featuredProducts);
              }
       }, [products]);

       // Auto-rotate hero images every 5 seconds
       useEffect(() => {
              const heroImagesData = getHeroImages();
              if (heroImagesData.length > 0) {
                     const imageInterval = setInterval(() => {
                            setCurrentImageIndex((prevIndex) =>
                                   (prevIndex + 1) % heroImagesData.length
                            );
                     }, 5000);

                     return () => clearInterval(imageInterval);
              }
       }, [getHeroImages, heroProducts]);

       // Reset image loading state when image index changes
       useEffect(() => {
              setImageLoading(true);
       }, [currentImageIndex]);

       const fetchProducts = async () => {
              try {
                     const response = await productsAPI.getAll();
                     setProducts(response.data);
                     setFilteredProducts(response.data);
              } catch (error) {
                     console.error('Error fetching products:', error);

                     // Show user-friendly error message
                     if (error && typeof error === 'object' && 'code' in error && error.code === 'NETWORK_ERROR') {
                            console.log('Backend server might not be running. Please start Django server on port 8000.');
                     } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message.includes('Network Error')) {
                            console.log('Backend server might not be running. Please start Django server on port 8000.');
                     }

                     // Set fallback demo products
                     const fallbackProducts = [
                            {
                                   id: 1,
                                   name: 'Demo Smartphone',
                                   description: 'This is demo data - API connection failed',
                                   price: '699.99',
                                   image_url: '',
                                   category_name: 'Electronics',
                                   stock_quantity: 10
                            },
                            {
                                   id: 2,
                                   name: 'Demo Laptop',
                                   description: 'This is demo data - API connection failed',
                                   price: '1299.99',
                                   image_url: '',
                                   category_name: 'Electronics',
                                   stock_quantity: 5
                            }
                     ];
                     setProducts(fallbackProducts);
                     setFilteredProducts(fallbackProducts);
              } finally {
                     setLoading(false);
              }
       };

       // Apply filters whenever filter states change
       useEffect(() => {
              let filtered = [...products];

              // Filter by category
              if (selectedCategory && selectedCategory !== 'all') {
                     filtered = filtered.filter(product =>
                            product.category_name.toLowerCase() === selectedCategory.toLowerCase()
                     );
              }

              // Filter by price range
              if (priceRange) {
                     filtered = filtered.filter(product => {
                            const price = parseFloat(product.price);
                            switch (priceRange) {
                                   case 'under-50':
                                          return price < 50;
                                   case '50-100':
                                          return price >= 50 && price <= 100;
                                   case '100-500':
                                          return price >= 100 && price <= 500;
                                   case 'over-500':
                                          return price > 500;
                                   default:
                                          return true;
                            }
                     });
              }

              // Sort products
              switch (sortBy) {
                     case 'price-low':
                            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                            break;
                     case 'price-high':
                            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                            break;
                     case 'name':
                            filtered.sort((a, b) => a.name.localeCompare(b.name));
                            break;
                     case 'newest':
                            // Assuming newer products have higher IDs
                            filtered.sort((a, b) => b.id - a.id);
                            break;
                     default:
                            // Keep original order for relevance
                            break;
              }

              setFilteredProducts(filtered);
       }, [selectedCategory, priceRange, sortBy, products]);

       if (loading) {
              return (
                     <div className="min-h-screen flex items-center justify-center">
                            <div className="text-xl">Loading products...</div>
                     </div>
              );
       }

       return (
              <div className="min-h-screen bg-gray-50">
                     {/* Hero Banner */}
                     <div className="relative bg-gradient-hero overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                   <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full"></div>
                                   <div className="absolute top-32 right-20 w-16 h-16 bg-secondary-500 rounded-full"></div>
                                   <div className="absolute bottom-20 left-32 w-12 h-12 bg-accent-500 rounded-full"></div>
                            </div>

                            <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
                                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                          {/* Left Content */}
                                          <div className="text-center lg:text-left space-y-6">
                                                 <div className="space-y-4">
                                                        <div className="inline-block bg-accent-100 text-accent-800 px-4 py-2 rounded-full text-sm font-semibold">
                                                               🔥 Limited Time Offer
                                                        </div>
                                                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                                                               Grab Upto{' '}
                                                               <span className="text-primary-600 relative">
                                                                      50% Off
                                                                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-200" viewBox="0 0 200 12" fill="currentColor">
                                                                             <path d="M0,8 Q50,0 100,4 T200,6 L200,12 L0,12 Z" />
                                                                      </svg>
                                                               </span>
                                                               {' '}On Selected Products
                                                        </h1>
                                                        <p className="text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                                                               Discover amazing deals on your favorite products. Shop now and save big!
                                                        </p>
                                                 </div>

                                                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                                        <button
                                                               onClick={() => window.location.href = '/categories'}
                                                               className="btn-primary text-lg px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-200"
                                                        >
                                                               Shop Now
                                                        </button>
                                                        <button
                                                               onClick={() => window.location.href = '/deals'}
                                                               className="border-2 border-primary-600 text-primary-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-600 hover:text-white transition-all duration-200"
                                                        >
                                                               View Deals
                                                        </button>
                                                 </div>

                                                 {/* Stats */}
                                                 <div className="flex justify-center lg:justify-start space-x-8 pt-4">
                                                        <div className="text-center">
                                                               <div className="text-2xl font-bold text-gray-900">10K+</div>
                                                               <div className="text-sm text-gray-600">Happy Customers</div>
                                                        </div>
                                                        <div className="text-center">
                                                               <div className="text-2xl font-bold text-gray-900">500+</div>
                                                               <div className="text-sm text-gray-600">Products</div>
                                                        </div>
                                                        <div className="text-center">
                                                               <div className="text-2xl font-bold text-gray-900">24/7</div>
                                                               <div className="text-sm text-gray-600">Support</div>
                                                        </div>
                                                 </div>
                                          </div>

                                          {/* Right Content - Dynamic Image */}
                                          <div className="relative flex justify-center lg:justify-end">
                                                 <div className="relative z-10">
                                                        {/* Main Circle with Auto-changing Images */}
                                                        <div className={`w-72 h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br ${heroImages[currentImageIndex]?.color || 'from-blue-200 via-blue-300 to-blue-400'} rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-1000 ease-in-out transform hover:scale-105`}>
                                                               {/* Animated Background */}
                                                               <div className={`absolute inset-0 bg-gradient-to-br ${heroImages[currentImageIndex]?.bgColor || 'from-blue-300/50 to-purple-400/50'} animate-pulse transition-all duration-1000`}></div>

                                                               {/* Product Image with Fade Transition */}
                                                               <div
                                                                      className="relative z-20 w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden shadow-lg transition-all duration-500 cursor-pointer border-4 border-white/20"
                                                                      onClick={() => {
                                                                             if (heroImages[currentImageIndex]?.id) {
                                                                                    window.location.href = `/product/${heroImages[currentImageIndex].id}`;
                                                                             }
                                                                      }}
                                                               >
                                                                      {/* Loading Spinner */}
                                                                      {imageLoading && (
                                                                             <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
                                                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                                                             </div>
                                                                      )}

                                                                      {heroImages[currentImageIndex]?.image ? (
                                                                             <Image
                                                                                    key={`${currentImageIndex}-${heroImages[currentImageIndex]?.id}`}
                                                                                    src={heroImages[currentImageIndex].image}
                                                                                    alt={heroImages[currentImageIndex].title}
                                                                                    fill
                                                                                    className={`object-cover object-center transition-all duration-1000 ease-in-out hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                                                                           }`}
                                                                                    onLoad={() => setImageLoading(false)}
                                                                                    onLoadStart={() => setImageLoading(true)}
                                                                                    onError={(e) => {
                                                                                           const target = e.target as HTMLImageElement;
                                                                                           target.style.display = 'none';
                                                                                           const fallback = target.nextElementSibling as HTMLElement;
                                                                                           if (fallback) {
                                                                                                  fallback.style.display = 'flex';
                                                                                                  setImageLoading(false);
                                                                                           }
                                                                                    }}
                                                                                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                                                                             />
                                                                      ) : null}

                                                                      {/* Emoji Fallback */}
                                                                      <div className="absolute inset-0 flex items-center justify-center text-6xl lg:text-7xl xl:text-8xl animate-bounce transition-all duration-500" style={{ display: 'none' }}>
                                                                             {heroImages[currentImageIndex]?.emoji || '🛍️'}
                                                                      </div>
                                                               </div>

                                                               {/* Discount Badge */}
                                                               <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse z-30">
                                                                      {heroImages[currentImageIndex]?.discount || '30% OFF'}
                                                               </div>

                                                               {/* Price Badge */}
                                                               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-30">
                                                                      ${heroImages[currentImageIndex]?.price || '99.99'}
                                                               </div>

                                                               {/* Product Title */}
                                                               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg max-w-xs z-30">
                                                                      <span className="text-sm font-semibold text-gray-800 text-center block truncate">
                                                                             {heroImages[currentImageIndex]?.title || 'Featured Product'}
                                                                      </span>
                                                                      <span className="text-xs text-gray-500 text-center block">
                                                                             {heroImages[currentImageIndex]?.category || 'Electronics'}
                                                                      </span>
                                                               </div>

                                                               {/* Floating Elements */}
                                                               <div className="absolute bottom-8 left-4 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce z-30">
                                                                      <span className="text-white text-lg font-bold">%</span>
                                                               </div>
                                                               <div className="absolute top-1/2 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping z-30"></div>
                                                        </div>

                                                        {/* Floating Cards */}
                                                        <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 animate-float z-10">
                                                               <div className="flex items-center space-x-3">
                                                                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                             <span className="text-indigo-600 text-sm">✓</span>
                                                                      </div>
                                                                      <div>
                                                                             <div className="text-sm font-semibold text-gray-800">Free Shipping</div>
                                                                             <div className="text-xs text-gray-500">On orders $50+</div>
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 animate-float-delayed z-10">
                                                               <div className="flex items-center space-x-3">
                                                                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                                             <span className="text-red-600 text-sm">🔥</span>
                                                                      </div>
                                                                      <div>
                                                                             <div className="text-sm font-semibold text-gray-800">Hot Deal</div>
                                                                             <div className="text-xs text-gray-500">Limited time</div>
                                                                      </div>
                                                               </div>
                                                        </div>

                                                        {/* Image Navigation Dots */}
                                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                                               {heroImages.map((_, index) => (
                                                                      <button
                                                                             key={index}
                                                                             onClick={() => setCurrentImageIndex(index)}
                                                                             className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                                                                    ? 'bg-indigo-600 scale-125'
                                                                                    : 'bg-gray-300 hover:bg-gray-400'
                                                                                    }`}
                                                                      />
                                                               ))}
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     {/* Filters Section */}
                     <div className="bg-white border-b border-gray-200 py-4">
                            <div className="max-w-7xl mx-auto px-4">
                                   <div className="flex items-center space-x-6 text-sm flex-wrap gap-2">
                                          {/* Product Type Filter */}
                                          <div className="relative">
                                                 <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                 >
                                                        <option value="">All Categories</option>
                                                        <option value="Electronics">Electronics</option>
                                                        <option value="Clothing">Clothing</option>
                                                        <option value="Books">Books</option>
                                                        <option value="Home & Garden">Home & Garden</option>
                                                        <option value="Sports">Sports</option>
                                                 </select>
                                                 <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                 </svg>
                                          </div>

                                          {/* Price Filter */}
                                          <div className="relative">
                                                 <select
                                                        value={priceRange}
                                                        onChange={(e) => setPriceRange(e.target.value)}
                                                        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                 >
                                                        <option value="">All Prices</option>
                                                        <option value="under-50">Under $50</option>
                                                        <option value="50-100">$50 - $100</option>
                                                        <option value="100-500">$100 - $500</option>
                                                        <option value="over-500">Over $500</option>
                                                 </select>
                                                 <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                 </svg>
                                          </div>

                                          {/* Offer Filter (Placeholder) */}
                                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded">
                                                 <span>Offer</span>
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                 </svg>
                                          </button>

                                          {/* Clear Filters Button */}
                                          <button
                                                 onClick={() => {
                                                        setSelectedCategory('');
                                                        setPriceRange('');
                                                        setSortBy('relevance');
                                                 }}
                                                 className="bg-gray-100 px-3 py-1 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                                          >
                                                 Clear Filters
                                          </button>

                                          {/* Sort By */}
                                          <div className="ml-auto relative">
                                                 <select
                                                        value={sortBy}
                                                        onChange={(e) => setSortBy(e.target.value)}
                                                        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                 >
                                                        <option value="relevance">Sort by Relevance</option>
                                                        <option value="price-low">Price: Low to High</option>
                                                        <option value="price-high">Price: High to Low</option>
                                                        <option value="name">Name: A to Z</option>
                                                        <option value="newest">Newest First</option>
                                                 </select>
                                                 <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                 </svg>
                                          </div>
                                   </div>

                                   {/* Active Filters Display */}
                                   {(selectedCategory || priceRange) && (
                                          <div className="mt-3 flex items-center space-x-2">
                                                 <span className="text-sm text-gray-500">Active filters:</span>
                                                 {selectedCategory && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                               {selectedCategory}
                                                               <button
                                                                      onClick={() => setSelectedCategory('')}
                                                                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                                                               >
                                                                      ×
                                                               </button>
                                                        </span>
                                                 )}
                                                 {priceRange && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                               {priceRange === 'under-50' ? 'Under $50' :
                                                                      priceRange === '50-100' ? '$50-$100' :
                                                                             priceRange === '100-500' ? '$100-$500' :
                                                                                    priceRange === 'over-500' ? 'Over $500' : priceRange}
                                                               <button
                                                                      onClick={() => setPriceRange('')}
                                                                      className="ml-1 text-blue-600 hover:text-blue-800"
                                                               >
                                                                      ×
                                                               </button>
                                                        </span>
                                                 )}
                                          </div>
                                   )}
                            </div>
                     </div>

                     <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl shadow-xl">
                            <div className="flex justify-between items-center mb-12">
                                   <div>
                                          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                                 Discover Products
                                          </h2>
                                          <p className="text-gray-600 flex items-center">
                                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-2">
                                                        {filteredProducts.length} items
                                                 </span>
                                                 Curated just for you
                                          </p>
                                   </div>
                                   <div className="hidden md:flex items-center space-x-4">
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                                 <span>Live inventory</span>
                                          </div>
                                   </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
                                   {filteredProducts.map((product) => (
                                          <div key={product.id} className="group relative">
                                                 <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                                 <div className="relative">
                                                        <ProductCard product={product} />
                                                 </div>
                                          </div>
                                   ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                   <div className="text-center py-16">
                                          <div className="relative inline-block mb-6">
                                                 <div className="text-8xl opacity-20">🔍</div>
                                                 <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse opacity-30"></div>
                                                 </div>
                                          </div>
                                          <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
                                          <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                                                 We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
                                          </p>
                                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                                 <button
                                                        onClick={() => {
                                                               setSelectedCategory('');
                                                               setPriceRange('');
                                                               setSortBy('relevance');
                                                        }}
                                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                 >
                                                        Clear All Filters
                                                 </button>
                                                 <button
                                                        onClick={() => window.location.href = '/categories'}
                                                        className="border-2 border-indigo-300 text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200"
                                                 >
                                                        Browse Categories
                                                 </button>
                                          </div>
                                   </div>
                            )}
                     </div>
              </div>
       );
}