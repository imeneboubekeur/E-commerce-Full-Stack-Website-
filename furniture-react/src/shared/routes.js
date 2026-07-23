import React from "react";
import Layout from "./components/layout";
import Home from "./components/home";
import ItemPage from "./components/item";
import Admin from "./components/admin";
import ProductForm from "./components/addProduct";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import CartPage from "./components/cart";
import CheckoutPage from "./components/checkout";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <HomePage /> },
      { path: "product/:id", element: <ItemPage /> },
      { path: "furnitures/:id", element: <ItemPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> }
    ]
  },
  { path: "/admin", element: <Admin /> },
  { path: "/product", element: <ProductForm /> },
  { path: "/product/:id", element: <ProductForm /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> }
];
 