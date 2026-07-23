import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const OrderPage = () => {

    const {
        singleProduct,
        singleLoading,
        singleError
    } = useSelector(state => state.products);

    if (singleLoading) return <h2>Loading...</h2>;
    if (singleError) return <h2>{singleError}</h2>;
    if (!singleProduct) return <h2>Product not found</h2>;
    const shipping = 20;
    const tax = singleProduct.price * 0.05;
    const total = singleProduct.price + shipping + tax;
    const items = [
  {
    ...singleProduct,
    quantity: 1,
  },
];
const makePayment= async()=>{
const stripe=await loadStripe(window.__STRIPE_KEY__)
const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        items:items,
                shipping_address:"",
         amount:total
      }),
    });
const data= await res.json();

 window.location.href = data.url;
}
    return (

        <div className="order-container">

            <div className="order-card">

                <h1>Order Summary</h1>

                <div className="product-card">

                    <img
                        src={singleProduct.image_url}
                        alt={singleProduct.name}
                    />

                    <div className="product-info">

                        <h2>{singleProduct.name}</h2>

                        <p className="price">
                            ${singleProduct.price}
                        </p>


                       
                       

                    </div>

                </div>

                <hr />

                <div className="address">

                    <h3>Shipping Address</h3>

                    <textarea
                        placeholder="Enter your address..."
                    />

                </div>

                <div className="coupon">

                    <h3>Coupon Code</h3>

                    <div className="coupon-input">

                        <input
                            type="text"
                            placeholder="Coupon"
                        />

                        <button>
                            Apply
                        </button>

                    </div>

                </div>

                <hr />

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${singleProduct.price}</span>
                </div>

                <div className="summary-row">
                    <span>Shipping</span>
                    <span>${shipping}</span>
                </div>

                <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax}</span>
                </div>

                <hr />

                <div className="summary-row total">
                    <span>Total</span>
                    <span>${total}</span>
                </div>

                <button className="checkout-btn"
                onClick={makePayment}
>
                    Continue to Payment
                </button>

            </div>

        </div>

    );

};

export default OrderPage;