"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { productsAPI, cartAPI } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_name: string;
  stock_quantity: number;
}
interface ProductModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}
export default function ProductModal({
  productId,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showSuccess, showError } = useToast();
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await productsAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);
  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [fetchProduct, isOpen, productId]);
  const handleAddToCart = async () => {
    if (!product) return;
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      showError("Please login to add items to cart");
      return;
    }
    setIsAdding(true);
    try {
      await cartAPI.add(product.id);
      showSuccess(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Error adding product to cart");
    } finally {
      setIsAdding(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {" "}
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between p-6 border-b">
          {" "}
          <h2 className="text-xl font-semibold">Product Details</h2>{" "}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {" "}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />{" "}
            </svg>{" "}
          </button>{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="p-6">
          {" "}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              {" "}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>{" "}
            </div>
          ) : product ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {" "}
              {/* Product Image */}{" "}
              <div className="relative h-64 md:h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                {" "}
                {product.image_url &&
                product.image_url.trim() !== "" &&
                !imageError ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    {" "}
                    <div className="text-6xl mb-2">
                      {" "}
                      {product.category_name === "Electronics"
                        ? "📱"
                        : product.category_name === "Clothing"
                        ? "👕"
                        : product.category_name === "Books"
                        ? "📚"
                        : product.category_name === "Home & Garden"
                        ? "🏠"
                        : product.category_name === "Sports"
                        ? "⚽"
                        : "🛍️"}{" "}
                    </div>{" "}
                    <p>No image available</p>{" "}
                  </div>
                )}{" "}
              </div>{" "}
              {/* Product Info */}{" "}
              <div className="space-y-4">
                {" "}
                <div>
                  {" "}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>{" "}
                  <p className="text-gray-600">{product.description}</p>{" "}
                </div>{" "}
                <div className="flex items-center space-x-4">
                  {" "}
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>{" "}
                  <span className="text-lg text-gray-500 line-through">
                    {" "}
                    ${(parseFloat(product.price) * 1.2).toFixed(2)}{" "}
                  </span>{" "}
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                    {" "}
                    Save 17%{" "}
                  </span>{" "}
                </div>{" "}
                <div className="flex items-center space-x-2">
                  {" "}
                  <span
                    className={`w-3 h-3 rounded-full ${
                      product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>{" "}
                  <span className="text-gray-600">
                    {" "}
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} in stock`
                      : "Out of stock"}{" "}
                  </span>{" "}
                </div>{" "}
                <div className="pt-4">
                  {" "}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock_quantity === 0}
                    className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400 transition-colors"
                  >
                    {" "}
                    {isAdding ? "Adding..." : "Add to Cart"}{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ) : (
            <div className="text-center py-12">
              {" "}
              <p className="text-gray-500">Product not found</p>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
