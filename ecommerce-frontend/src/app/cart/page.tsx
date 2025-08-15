"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartAPI, ordersAPI } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";

interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

interface Cart {
  id: number;
  items: CartItem[];
  total_price: string;
  total_items: number;
}

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, [router]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartAPI.update(itemId, quantity);
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartAPI.remove(itemId);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      showError("Please enter a shipping address");
      return;
    }
    setIsOrdering(true);
    try {
      await ordersAPI.create(shippingAddress);
      showSuccess("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      showError("Error placing order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-neutral-700">
            Loading your cart...
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-neutral-600 text-lg mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to fill it up!
            </p>
            <button
              onClick={() => router.push("/")}
              className="btn-primary px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Shopping Cart
          </h1>
          <p className="text-neutral-600 text-lg">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card-modern p-6 mb-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30 rounded-2xl border border-primary-100/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Product Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-primary-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">
                          {item.product_name}
                        </h3>
                        <p className="text-neutral-600 font-medium">
                          ${item.product_price} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-white rounded-xl border border-primary-200 shadow-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-l-xl transition-colors font-bold"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-10 h-10 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-r-xl transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-lg font-semibold text-neutral-900 w-20 text-right">
                        ${item.subtotal}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-primary-200">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-neutral-900">
                    Total: ${cart.total_price}
                  </div>
                  <div className="text-lg font-semibold text-neutral-600">
                    {cart.total_items}{" "}
                    {cart.total_items === 1 ? "item" : "items"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="lg:col-span-1">
            <div className="card-modern p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Checkout
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-neutral-700 mb-3"
                >
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Enter your complete shipping address..."
                />
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-semibold">${cart.total_price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-primary-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-neutral-900">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      ${cart.total_price}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isOrdering || !shippingAddress.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isOrdering ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
