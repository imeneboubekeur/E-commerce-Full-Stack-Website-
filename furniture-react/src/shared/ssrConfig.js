// ssrConfig.js
import {
  fetchProductsSuccess,
} from "./slices/productsSlice";

import {
  fetchCategoriesSuccess,
} from "./slices/categoriesSlice";

import {
  fetchSingleSuccess,
} from "./slices/productsSlice";

import {
  fetchCartSuccess,
} from "./slices/cartSlice";

import {
  fetchOrdersSuccess,
} from "./slices/ordersSlice";
import {
  fetchWishlistSuccess,
} from "./slices/wishlistSlice";
import {
  fetchReviewsSuccess,
} from "./slices/reviewsSlice";
import { loginSuccess } from "./slices/authSlice";
import { fetchCustomersSuccess,applyFilters } from "./slices/customersSlice";
import { fetchOrderSuccess } from "./slices/ordersSlice";
import { fetchDashboardStart,fetchDashboardSuccess,fetchProductStatsSuccess ,fetchOrderStatsSuccess,fetchCustomerStatsSuccess} from "./slices/dashboardSlice";
export const ssrConfig = [
  {
  match: (url) => url.startsWith("/admin/orders"),
  load: async (store, fetchSSR, url) => {
     const query = url.split("?")[1] || "";
    const data = await fetchSSR(`/admin/orders?${query}`);
    store.dispatch(fetchOrderStatsSuccess(data));
  },
  
},
{
    match: (url) => url.startsWith("/admin/orders"),
    
   
  load: async (store, fetchSSR, url) => {
      const query = url.split("?")[1] || "";
      const res = await fetchSSR(`/orders?${query}`);

      if (res?.error) return res;

      store.dispatch(fetchOrdersSuccess(res));
      return { ok: true };
    },
  },
   {
  match: (url) => url.startsWith("/admin/products"),
  load: async (store, fetchSSR, url) => {

     const query = url.split("?")[1] || "";
    const data = await fetchSSR(`/admin/products?${query}`);
    const productStats = await fetchSSR("/admin/products");
    store.dispatch(fetchProductStatsSuccess(data));
  },
  
},
{
  match: (url) => url.startsWith("/admin/customers"),
  load: async (store, fetchSSR, url) => {

     const query = url.split("?")[1] || "";
    const data = await fetchSSR(`/admin/customers?${query}`);
    const productStats = await fetchSSR("/admin/customers");
    store.dispatch(fetchCustomerStatsSuccess(data));
  },
  
},
{
  match: (url) => url.startsWith("/products"),
  load: async (store, fetchSSR, url) => {

     const query = url.split("?")[1] || "";
    const data = await fetchSSR(`/products?${query}`);
    const productStats = await fetchSSR("/products");
    store.dispatch(fetchProductStatsSuccess(data));
  },
  
},
   {
    match: (url) => url.startsWith("/admin/admin"),
   
      load: async (store, fetchSSR) => {
      const res = await fetchSSR("/admin/admin");
      if (res?.error) return res;

      store.dispatch(fetchDashboardSuccess(res));
      return { ok: true };
    },
  },
  {
    match: (url) => url === "/" || url.startsWith("/products")|| url.startsWith("/admin/products"),
    load: async (store, fetchSSR) => {
      const products = await fetchSSR("/products");
store.dispatch(fetchProductsSuccess(products));    },
  },
  {
    match: (url) => true,
    load: async (store, fetchSSR) => {
      const categories = await fetchSSR("/categories");
      store.dispatch(fetchCategoriesSuccess(categories));
    },
  },
  {
    match: (url) => url.startsWith("/product/"),
    load: async (store, fetchSSR, url) => {
      const id = url.split("/")[2];
      const product = await fetchSSR(`/products/${id}`);
      store.dispatch( fetchSingleSuccess(product));
    },
  },
  {
    match: (url) => url.startsWith("/order/"),
    load: async (store, fetchSSR, url) => {
       try {
              const id = url.split("/")[2];

      const product = await fetchSSR(`/products/${id}`);
      store.dispatch( fetchSingleSuccess(product));
    } catch (err) {
      if (err.status=== 401) {
  return { redirect: "/login" };        
        return;
      }

      console.error(err);
    }
    
    },
  },
  {
  match: (url) => url.startsWith("/cart"),
  load: async (store, fetchSSR) => {
    try {
      const cart = await fetchSSR("/cart");

      store.dispatch(fetchCartSuccess(cart));
    } catch (err) {
      if (err.status=== 401) {
  return { redirect: "/login" };        
        return;
      }

      console.error(err);
    }
  },
},
  
   {
    match: (url) => url.startsWith("/wishlist"),
    load: async (store, fetchSSR) => {
       try {
      const wishlist = await fetchSSR("/wishlist");

      store.dispatch(fetchWishlistSuccess(wishlist));
    } catch (err) {
      if (err.status=== 401) {
  return { redirect: "/login" };        
        return;
      }

      console.error(err);
    }
     
    },
  },
  {
    match: (url) => url.startsWith("/admin/customers"),
    load: async (store, fetchSSR,url) => {
       const query = url.split("?")[1] || "";
    const data = await fetchSSR(`/customers?${query}`);
    const customers = await fetchSSR("/customers");
    store.dispatch(fetchCustomersSuccess(data)); 
  
      
    },
  },
  {
    match: (url) => url.startsWith("/admin"),
    load: async (store, fetchSSR,url) => {
       const query = url.split("?")[1] || "";
    const data = await fetchSSR("/auth/me");
    const customers = await fetchSSR("/customers");
    store.dispatch(loginSuccess(data)); 
  
      
    },
  },
  
 

   {
    match: (url) => url.startsWith("/product/"),
    load: async (store, fetchSSR,url) => {
       const id = url.split("/")[2];
      const reviews = await fetchSSR(`/reviews/product/${id}`);
      store.dispatch(fetchReviewsSuccess(reviews));
    }, 
  },
  {
    match: (url) => url.startsWith("/admin/orders/"),
    load: async (store, fetchSSR,url) => {
      
      const order = await fetchSSR(`/orders/${id}`);

      store.dispatch(fetchOrderSuccess(order));
  
    }
     
  
  },
  
];