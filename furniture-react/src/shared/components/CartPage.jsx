import { Link } from 'react-router-dom';
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import  { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import {
  updateCartItem,
  removeFromCart,
  clearCart,
fetchCartSuccess
} from '../slices/cartSlice';

//import { createOrderStart, createOrderSuccess, createOrderFailure } from '../slices/ordersSlice';
export  function CartItem({data}){

  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
    const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }

    try {

      await cartAPI.updateItem(cartId, quantity);

      dispatch(updateCartItem({ id: cartId, quantity }));
    } catch (err) {
       console.error(err);
    console.error(err.response);
    console.error(err.message);
      alert(err.message); 
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await cartAPI.removeItem(cartId);
      dispatch(removeFromCart(cartId));
    } catch (err) {
      alert(err.message);
    }
  };
    return(
        
            
              <tbody>
                <tr>
                    <td>
                      <img src={data.image_url} />
                    </td>
                    <td>
                    {data.name}
                    </td>
                    <td>
                      ${data.price}
                    </td>
                    <td>
                        <button onClick={() => handleUpdateQuantity(data.id, data.quantity - 1)}>-</button>
                  <span>{data.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(data.id, data.quantity + 1)}>+</button>
                    </td>
                    <td>
                      ${(data.price * data.quantity).toFixed(2)}
                    </td>


                    <td>
               <button onClick={() => handleRemoveItem(data.id)} className="btn-remove">
                  Remove
                </button>       
                    </td>
                  </tr>


         
          </tbody>
    
) }


function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn ,initializing} = useSelector((state) => state.auth);
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');

  

  const handleRemoveItem = async (cartId) => {
    try {
      await cartAPI.removeItem(cartId);
      dispatch(removeFromCart(cartId));
    } catch (err) {
      alert(err.message);
    }
  };

 
const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data - items should have product_id from cart
      const orderData = {
        items: items.map(item => ({
          product_id: item.product_id,  // Must exist in cart items
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: shippingAddress
      };

      const order = await ordersAPI.createOrder(orderData);
      
      // Clear the cart after successful order
      dispatch(clearCart());
      
      // Navigate to orders page or show success message
      alert(`Order #${order.id} placed successfully!`);
      navigate('/orders');
    } catch (err) {
      alert(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };
 
const makePayment= async()=>{
const stripe=await loadStripe(window.__STRIPE_KEY__)
const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        items:items,
        shipping_address:shippingAddress,
         amount:totalPrice.toFixed(2)
      }),
    });
const data= await res.json();

 window.location.href = data.url;
}
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
        <div className="cartContainer">
        <div className="table-wrapper">
             <table>
                      <thead>
                        <tr style={{width:"100%"}}>
                          <th style={{width:"15%"}}>Image</th>
                          <th>Title</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
        
                          <th style={{width:"10%"}}>Delete</th>
                        </tr>
                      </thead>
            {items.map((item)=>(
                <CartItem key={item.id} data={item}/>
            )
            )}
            </table>
            </div>
         

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div><p><span style={{fontWeight:"900"}}>Total: </span>${totalPrice.toFixed(2)}</p></div>
             <div className="shipping-address">
              <label htmlFor="shipping" style={{fontWeight:"900"}}>Shipping Address:</label>
              <input
                id="shipping"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your shipping address"
                rows="3"
              />
            </div>

            <button
              onClick={makePayment}
              className="btn btn-primary btn-checkout"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Checkout'}
            </button>

          </div>
          </div>
         
        </>
      )}
    </div>
  );
}

export default CartPage;
