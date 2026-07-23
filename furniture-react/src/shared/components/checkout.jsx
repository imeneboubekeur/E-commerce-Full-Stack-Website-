// pages/CheckoutPage.jsx
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../slices/ordersSlice';
import { clearCart } from '../slices/cartSlice';
import { cartAPI } from '../services/api';
import { fetchCartSuccess } from '../slices/cartSlice';
export default function CheckoutPage(){
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const { isLoggedIn, initializing } = useSelector((state) => state.auth);
  const { items, totalPrice } = useSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
  const { createOrderLoading, createOrderError } = useSelector((state) => state.orders);
    const [pageLoading, setPageLoading] = useState(true);
      const [shippingAddress, setShippingAddress] = useState('');
    const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
useEffect(() => {
    if (initializing) return;
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch cart data when component mounts
    cartAPI.getCart()
      .then((res) => {
        dispatch(fetchCartSuccess(res));
      })
      .catch((err) => {
        console.error('Failed to load cart:', err);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [isLoggedIn, initializing, navigate, dispatch]);

  // Show loading state
  if (pageLoading) {
    return (
      <div className="checkout-page">
        <p>Loading checkout...</p>
      </div>
    );
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
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
  const validateForm = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!shippingInfo.country.trim()) newErrors.country = 'Country is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Format shipping address
    const shippingAddress = `${shippingInfo.fullName}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}
${shippingInfo.country}
Phone: ${shippingInfo.phone}`;

    try {
      // Prepare order data with properly formatted items
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          product_id: item.product_id || item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image: item.image
        })),
        shipping_address: shippingAddress
      };


      // Dispatch createOrder action
      const result = await dispatch(createOrder(orderData)).unwrap();


      // Clear the cart after successful order
      dispatch(clearCart());

      // Show success message
      alert(`Order #${result.id} placed successfully!`);

      // Redirect to order details page
      navigate(`/orders/${result.id}`, {
        state: { message: 'Your order has been placed successfully!' }
      });

    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order: ' + error);
    }
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before checking out</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="cart-summary">
            <h3>Order Summary</h3>
            <div><p><span style={{fontWeight:"900"}}>Total: </span>${totalPrice.toFixed(2)}</p></div>
             <div className="shipping-address">
              <label htmlFor="shipping" style={{fontWeight:"900"}}>Shipping Address:</label>
              <input
                id="shipping"
                
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
    </div>
  );
};

