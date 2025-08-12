const stripe = require("stripe")(process.env.GATSBY_STRIPE_SECRET_KEY); // Ensure this environment variable is correctly set

exports.handler = async (event) => {
  try {
    // Parse the request body
    const {
      name,
      title,
      phone,
      email,
      company,
      vat,
      shipping,
      billing,
      country,
      totalPriceInCents,
      basicPriceInCents,
      quantity,
      vatAmount,
      orderId,
    } = JSON.parse(event.body);

    // Calculate the total amount
    const amount = Number(totalPriceInCents);

    // Dynamic description to show base price and taxes
    const description =
      country === "Finland"
        ? `Base Price: €${(basicPriceInCents / 100).toFixed(2)} x ${quantity}, ALV: €${(
            vatAmount / 100
          ).toFixed(2)}`
        : `Base Price: €${(basicPriceInCents / 100).toFixed(2)} x ${quantity}, No Taxes charged`;

   
    // Check for existing payment intent
    const existingPaymentIntents = await stripe.paymentIntents.list({
      limit: 10, // Fetch up to 10 recent payment intents
    });

    const existingPaymentIntent = existingPaymentIntents.data.find(
      (intent) => intent.metadata && intent.metadata.orderId === orderId
    );

    if (existingPaymentIntent) {
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: existingPaymentIntent.client_secret }),
      };
    }

    // Create a new Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur", // Replace with the actual currency if needed
      payment_method_types: ["card"],
      shipping: {
        name,
        address: {
          line1: shipping || "N/A",
          country: country || "N/A",
        },
      },
      description: description, // Add the description here
      receipt_email: email, // This sends the recipient the email from Stripe
      metadata: {
        orderId,
        name,
        title,
        phone,
        email,
        company,
        vat,
        shipping,
        billing,
        country,
        quantity,
        vatAmount,
      },
    });

    // Log the generated client secret
    //console.log("Generated clientSecret:", paymentIntent.client_secret);

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};