import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51PpSo2P4khfNSNqxhD7z67FHWTMDfo8ovUNzG2iD1SqOnZ6wlJpDQjWiyRNb5ybVQqDYPSNgh1RwBwFI9rYhsOZC000RNnbg6r'); // Your Stripe live key

const BuyNowButton = ({ priceId, mode = "payment", quantity = 1, buttonText = "Buy Now" }) => {
  // Function to open the Stripe Checkout in a small popup window
  const openCheckoutModal = async () => {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe.js has not loaded.");
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        { price: priceId, quantity }, // Use the passed priceId and quantity
      ],
      mode: mode, // "payment" or "subscription"
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });

    if (error) {
      console.error("Error redirecting to Stripe:", error);
      return;
    }

    // Open Stripe Checkout in a small popup window
    window.open(error.url, '_blank', 'width=500,height=700');
  };

  return (
    <button
      type="button"
      onClick={openCheckoutModal}
      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-brandorange transition-colors"
    >
      {buttonText}
    </button>
  );
};

export default BuyNowButton;