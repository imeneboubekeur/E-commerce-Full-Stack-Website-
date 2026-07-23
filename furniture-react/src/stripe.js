import { loadStripe } from "@stripe/stripe-js";

export const stripePromise =
  typeof window !== "undefined"
    ? loadStripe(window.__STRIPE_KEY__)
    : null;
