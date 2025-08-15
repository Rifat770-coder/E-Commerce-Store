'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { productsAPI, cartAPI } from '@/utils/api';
import { useToast } from '@/contexts/ToastContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_name: string;
  stock_quantity: number;
  is_in_stock: boolean;
}

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const fetchProduct = useCallback(async (id: number) => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (params.id) {
      fetchProduct(Number(params.id));
    }
  }, [params.id, fetchProduct]);

  const handleAddToCart = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      showError('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product) return;

    setIsAdding(true);
    try {
      await cartAPI.add(product.id, quantity);
      showSuccess(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-neutral-700">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl font-semibold text-neutral-700">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={() => router.back()}
          className="mb-6 text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to products</span>
        </button>

        <div className="card-modern overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-primary-400 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-lg">No Image Available</div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <span className="text-sm text-primary-600 uppercase tracking-wide font-semibold bg-primary-100 px-2 py-1 rounded-full">
                  {product.category_name}
                </span>
                <h1 className="text-3xl font-bold text-neutral-900 mt-4">
                  {product.name}
                </h1>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-600">Stock:</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    product.stock_quantity > 0 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {product.stock_quantity > 0 
                      ? `${product.stock_quantity} available` 
                      : 'Out of stock'
                    }
                  </span>
                </div>
              </div>

              {product.stock_quantity > 0 && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-2">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-primary-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {Array.from({ length: Math.min(10, product.stock_quantity) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock_quantity === 0}
                  className="btn-primary w-full py-3 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding to Cart...</span>
                    </div>
                  ) : product.stock_quantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-neutral-200 text-neutral-800 py-3 px-6 rounded-xl font-semibold hover:bg-neutral-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}