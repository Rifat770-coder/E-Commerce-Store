'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function SearchResultsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && query) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, query]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Searching products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results {query && `for "${query}"`}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              All Categories
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm">
              Electronics
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm">
              Clothing
            </button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm">
              Books
            </button>
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
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
                    <span className="text-xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category_name}
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md font-medium hover:bg-green-800 transition-colors text-center block"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {query 
                ? `We couldn't find any products matching "${query}". Try different keywords.`
                : 'Try searching for something specific.'
              }
            </p>
            <Link
              href="/"
              className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Search Suggestions */}
        {query && filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Suggestions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-sm font-medium text-gray-800">Electronics</div>
              </button>
              <button className="text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">👕</div>
                <div className="text-sm font-medium text-gray-800">Clothing</div>
              </button>
              <button className="text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">📚</div>
                <div className="text-sm font-medium text-gray-800">Books</div>
              </button>
              <button className="text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">🏠</div>
                <div className="text-sm font-medium text-gray-800">Home & Garden</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading search results...</div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}