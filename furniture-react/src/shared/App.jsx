import React from "react";
import {
  createBrowserRouter,
  createStaticRouter,
  RouterProvider,
  StaticRouterProvider
} from "react-router-dom";
import { routes } from './routes';
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authAPI } from "./services/api";
import { loginSuccess, initializationComplete } from "./slices/authSlice";
import Layout from "./components/layout";
import Home from "./components/home";
import SearchResults from "./components/search";
import ItemPage from "./components/item";
import Admin from "./components/admin";
import Dashboard from "./components/dashboard";
import Orders from "./components/orders";
import Furnitures from "./components/furnitures";
import Furnitures1 from "./components/products";
import ProductForm from "./components/addProduct";
import ProductsAdmin from "./components/productsAdmin";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/checkout";
import Customers from "./components/customers";
import Checkout from "./components/checkout1";
import OrderDetails from "./components/orderSingle";
import OrderPage from "./components/singleOrder";
import Wishlist from "./components/wishlist";
import StoreSettings from "./components/settings/store";
import SecuritySettings from "./components/settings/security";
import CategorySettings from "./components/categories1";
import { PaymentSettings } from "./components/settings/payment";
import { ShippingSettings } from "./components/settings/shipping";
import { MediaSettings } from "./components/settings/media";
import { SecuritySettings1 } from "./components/settings/security";
import { usePageData } from "./hooks/usePageData";

export default function App() {
  const dispatch = useDispatch();
usePageData();
 useEffect(() => {
    // client-only
    if (typeof window === "undefined") return;
if (typeof window !== "undefined") {
  require("slick-carousel/slick/slick.css");
  require("slick-carousel/slick/slick-theme.css");
}

    
      authAPI
    .getCurrentUser()
    .then((user) => {
      dispatch(loginSuccess(user));
    })
    .catch((err) => {
      if (err.status === 401) {
        // Token is invalid or expired
      } else {
        // Server/network error
        console.error(err);
      }

      dispatch(initializationComplete());
    })
  }, [dispatch]);
  return( 
   <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<HomePage />} />
                <Route path="products" element={<Furnitures1 />} />

        <Route path="search" element={<SearchResults />} />
        <Route path="product/:id" element={<ItemPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="furnitures/:id" element={<ItemPage />} />
              <Route path="products" element={<Furnitures/>} />
        <Route path="security" element={<SecuritySettings1 />} />

        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="edit/:id" element={<ProductForm />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>
      <Route path="/admin" element={<Admin/>}>
      <Route path="admin" element={<Dashboard />} />
      <Route path="add" element={<ProductForm />} />
              <Route path="edit/:id" element={<ProductForm />} />
      <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategorySettings/>} />
      <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
      <Route path="store" element={<StoreSettings />} />
          <Route path="payment" element={<PaymentSettings />} />
      <Route path="shipping" element={<ShippingSettings />} />
      <Route path="media" element={<MediaSettings />} />
      <Route path="security" element={<SecuritySettings />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

    </Routes>)
 
}

