import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const StripeCheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    // Call the Netlify function to create a Payment Intent
    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }), // amount should be in cents
    });

    const { clientSecret } = await response.json();

    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setErrorMessage(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setPaymentSucceeded(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement />
      <button
        type="submit"
        disabled={!stripe}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-brandorange transition-colors"
      >
        Pay Now
      </button>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      {paymentSucceeded && <div style={{ color: "green" }}>Payment succeeded!</div>}
    </form>
  );
};

export default StripeCheckoutForm;