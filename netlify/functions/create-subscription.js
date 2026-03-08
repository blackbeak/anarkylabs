const stripe = require("stripe")(process.env.GATSBY_STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
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
      priceId,
      orderId,
    } = JSON.parse(event.body);

    // Create or retrieve a Stripe customer by email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        name,
        email,
        metadata: {
          company,
          vat,
          phone,
          title,
          country,
        },
        address: {
          line1: billing || "N/A",
          country: country || "N/A",
        },
        shipping: {
          name,
          address: {
            line1: shipping || "N/A",
            country: country || "N/A",
          },
        },
      });
    }

    // Apply Finnish VAT tax rate if country is Finland
    let defaultTaxRates = [];
    if (country === "Finland") {
      // Look for an existing 25.5% Finnish VAT tax rate
      const taxRates = await stripe.taxRates.list({ limit: 100, active: true });
      let finnishVAT = taxRates.data.find(
        (tr) => tr.percentage === 25.5 && tr.display_name === "ALV" && tr.active
      );

      // Create one if it doesn't exist
      if (!finnishVAT) {
        finnishVAT = await stripe.taxRates.create({
          display_name: "ALV",
          description: "Finnish VAT 25.5%",
          percentage: 25.5,
          inclusive: false,
          country: "FI",
        });
      }
      defaultTaxRates = [finnishVAT.id];
    }

    // Create a subscription with incomplete status so we can collect payment
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
          quantity: parseInt(quantity, 10) || 1,
          tax_rates: defaultTaxRates,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
      },
      expand: ["latest_invoice.payment_intent"],
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

    const clientSecret =
      subscription.latest_invoice.payment_intent.client_secret;

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret }),
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
