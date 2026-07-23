import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useState,useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../stripe";

export  function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return children;
}

export  function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         amount:50
      }),
    });
const session= await res.json();
const result=stripe.redirectToCheckout({
    sessionId:session.id
})

   
  };

  return (
    <>
      <CardElement />
      <button disabled={!stripe || loading} onClick={pay}>
        Pay $50
      </button>
    </>
  );
}
export default function Checkout() {
  return (
    <ClientOnly>
    <Elements stripe={stripePromise}>
      <h1>Checkout</h1>
      <CheckoutForm />
    </Elements>
    </ClientOnly>
  );
}