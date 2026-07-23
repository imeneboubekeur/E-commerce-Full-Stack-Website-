const API_URL = process.env.API_URL;
import { createFetchWithAuth } from './fetchWithAuth.js';
 
export const fetchWithAuth1 = createFetchWithAuth();
// Helper function for fetch requests
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }


  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const authAPI = {
  register: (email, password,confirmPassword, name) =>
    fetchWithAuth1('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password,confirmPassword, name }),
    }),

  login: (email, password) =>
    fetchWithAuth1('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
logout: () => (
 fetchWithAuth("/auth/logout", {
    method: "POST",
  })

 
),
  getCurrentUser: () =>
    fetchWithAuth1('/auth/me', { method: 'GET' },false),

  updateProfile: (data) =>
    fetchWithAuth1('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
     changePassword: (currentPassword, newPassword) =>
    fetchWithAuth1('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }),
forgotPassword: (email) =>
    fetchWithAuth1("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password, confirmPassword) =>
    fetchWithAuth1("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        password,
        confirmPassword,
      }),
    }),
};
export const adminAPI = {
  getDashboardStats: () =>
    fetchWithAuth1("/admin/admin", { method: "GET" }),
  getProductStats: () =>
    fetchWithAuth1("/admin/products", { method: "GET" }),
   getCustomerStats: () =>
    fetchWithAuth1("/admin/customers", { method: "GET" }),
};
export const productAPI = {
 getAll:async (filters) => {
  const params = new URLSearchParams(filters).toString();

  const res = await fetch(`/api/products?${params}`);
  return res.json();
  
}, 
   getById: (id) =>
    fetchWithAuth1(`/products/${id}`, { method: 'GET' }),
deleteProduct: (product_id) =>
    fetchWithAuth1(`/admin/products/${product_id}`, {
      method: 'DELETE',
    }),
};
export const productAPI1 = {
  getAll1: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/products${query ? '?' + query : ''}`, { method: 'GET' });
  },

 
 
};
export const categoriesAPI = {
  getAll: () => fetchWithAuth1("/categories"),

  create: (data) =>
    fetchWithAuth1("/categories", {
      method: "POST",
      body: data,
    }),

  update: (id, data) =>
    fetchWithAuth1(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    fetchWithAuth1(`/categories/${id}`, {
      method: "DELETE",
    }),
};
export const cartAPI = {
  getCart: () =>
    fetchWithAuth1('/cart', { method: 'GET' }),

  addToCart: (product_id, quantity) =>
    fetchWithAuth1('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity }),
    }),

  updateItem: async (cart_id, quantity) =>{
   const res = await fetchWithAuth1(`/cart/${cart_id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

 


  return res;
},

  removeItem: (cart_id) =>
    fetchWithAuth1(`/cart/${cart_id}`, { method: 'DELETE' }),

  clearCart: () =>
    fetchWithAuth1('/cart', { method: 'DELETE' }),
};

export const ordersAPI = {
   getOrders: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    
    return fetchWithAuth1(`/orders?${query}`);
  },
getOrderById: (orderId) =>
    fetchWithAuth1(`/orders/${orderId}`, { method: 'GET' }),
  createOrder: (orderData) =>  // ← Add parameter
    fetchWithAuth1('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),  // ← Send the data!
    }),
      updateOrderStatus: (orderId, status) =>
    fetchWithAuth1(`/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }),
    cancelOrder: (orderId) =>
    fetchWithAuth1(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
    }),
};

export const wishlistAPI = {
  getWishlist: () =>
    fetchWithAuth1('/wishlist', { method: 'GET' }),

  addToWishlist: (product_id) =>
    fetchWithAuth1('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ product_id }),
    }),

  removeFromWishlist: (product_id) =>
    fetchWithAuth1(`/wishlist/${product_id}`, { method: 'DELETE' }),
};

export const customersAPI = {
 
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetchWithAuth(`/customers?${query}`);
  },


  getById: (id) =>
    fetchWithAuth(`/customers/${id}`, { method: 'GET' }),

  delete: (id) =>
    fetchWithAuth(`/customers/${id}`, { method: 'DELETE' }),
};

export const settingsAPI = {
  get: (category) =>
    fetchWithAuth(`/admin/settings/${category}`),

  update: (key, value) =>
    fetchWithAuth(`/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value })
    })
};
export const reviewsAPI = {
  getProductReviews: (productId) =>
fetchWithAuth(`/reviews/product/${productId}`, { method: "GET" }),
  createReview: (data) =>
    fetchWithAuth("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
