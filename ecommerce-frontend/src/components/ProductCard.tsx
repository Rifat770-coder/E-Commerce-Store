'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cartAPI } from '@/utils/api';
import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

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
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      showError('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      await cartAPI.add(product.id);
      showSuccess(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCardClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    router.push(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking wishlist
    // Add wishlist functionality here
    showSuccess(`${product.name} added to wishlist!`);
  };

  return (
    <div
      className="card-modern overflow-hidden relative group flex flex-col h-full hover:border-primary-200"
    >
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 border border-gray-100"
      >
        <svg className="w-5 h-5 text-gray-400 hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-secondary-50/20 to-accent-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {product.image_url && product.image_url.trim() !== '' && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-6xl mb-2">
              {product.category_name === 'Electronics' ? '📱' :
               product.category_name === 'Clothing' ? '👕' :
               product.category_name === 'Books' ? '📚' :
               product.category_name === 'Home & Garden' ? '🏠' :
               product.category_name === 'Sports' ? '⚽' : '🛍️'}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
            {product.category_name}
          </span>
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              Only {product.stock_quantity} left
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Star Rating */}
        <div className="flex items-center mb-4 space-x-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.average_rating || 0) 
                    ? 'fill-current' 
                    : 'fill-gray-300'
                }`} 
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.average_rating ? (
              <span className="flex items-center space-x-1">
                <span className="font-medium">{product.average_rating.toFixed(1)}</span>
                <span className="text-gray-400">•</span>
                <span>{product.review_count || 0} reviews</span>
              </span>
            ) : (
              <span className="text-gray-400">No reviews yet</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${(parseFloat(product.price) * 1.2).toFixed(2)}
            </span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
              Save 17%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCardClick}
            className="btn-primary w-full py-3 px-4 font-semibold transform hover:scale-[1.02] transition-all duration-200"
          >
            View Details
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock_quantity === 0}
            className="w-full border-2 border-primary-200 text-primary-600 py-3 px-4 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : product.stock_quantity === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}