import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import ordersReducer from './slices/ordersSlice.js';
import productsReducer from './slices/productsSlice.js';
import customersReducer from './slices/customersSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';
import reviewsReducer from './slices/reviewsSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';
import categoriesReducer from './slices/categoriesSlice.js';


 
export function createStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      products: productsReducer,
      orders: ordersReducer,
      customers: customersReducer,
      wishlist: wishlistReducer,
      reviews: reviewsReducer,
      dashboard: dashboardReducer,
      categories:categoriesReducer,
    },
    preloadedState
  });
}