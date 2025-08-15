import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-api.com/api"
    : "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000, // 15 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error: unknown) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error: unknown) => {
    console.error("❌ API Error:", error);

    // Type guard to check if error is an axios error
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        console.error("🔌 Network Error: Backend server might not be running");
        error.message =
          "Unable to connect to server. Please check if the backend is running.";
      }

      if (error.response?.status === 403 || error.response?.status === 401) {
        // Clear authentication state on auth errors
        localStorage.removeItem("isLoggedIn");
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: unknown) => api.post("/users/register/", userData),
  login: (credentials: unknown) => api.post("/users/login/", credentials),
  logout: () => api.post("/users/logout/"),
};

// Products API
export const productsAPI = {
  getAll: () => api.get("/products/"),
  getById: (id: number) => api.get(`/products/${id}/`),
  getCategories: () => api.get("/categories/"),
};

// Cart API
export const cartAPI = {
  get: () => api.get("/cart/"),
  add: (productId: number, quantity: number = 1) =>
    api.post("/cart/add/", { product_id: productId, quantity }),
  update: (itemId: number, quantity: number) =>
    api.put(`/cart/update/${itemId}/`, { quantity }),
  remove: (itemId: number) => api.delete(`/cart/remove/${itemId}/`),
};

// Orders API
export const ordersAPI = {
  create: (shippingAddress: string) =>
    api.post("/orders/create/", { shipping_address: shippingAddress }),
  getAll: () => api.get("/orders/"),
  getById: (id: number) => api.get(`/orders/${id}/`),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId: number) => api.get(`/products/${productId}/reviews/`),
  create: (reviewData: {
    product: number;
    rating: number;
    title: string;
    comment: string;
  }) => api.post("/reviews/", reviewData),
  update: (reviewId: number, reviewData: {
    rating?: number;
    title?: string;
    comment?: string;
  }) => api.put(`/reviews/${reviewId}/`, reviewData),
  delete: (reviewId: number) => api.delete(`/reviews/${reviewId}/delete/`),
  getUserReviews: () => api.get("/users/reviews/"),
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await axios.get("http://localhost:8000/", {
      timeout: 5000,
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: errorMessage,
      suggestion: "Make sure Django server is running on http://localhost:8000",
    };
  }
};

export default api;
