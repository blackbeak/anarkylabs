import React, { useState } from "react";
import { graphql, navigate } from "gatsby";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique identifier
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentIcons from "../components/paymentIcons";

// Publishable key for stripe
const stripePromise = loadStripe(process.env.GATSBY_STRIPE_API_KEY);

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba",
  "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
  "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const CheckoutForm = ({ version, paymentMode = "annual" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [country, setCountry] = useState("");
  const [vatMessage, setVATMessage] = useState("");
  const [totalPriceWithVAT, setTotalPriceWithVAT] = useState(0);

  const VAT_RATE = 0.255; // 25.5% VAT for Finnish companies

  const isMonthly = paymentMode === "monthly";
  const activePrice = isMonthly ? version.monthlyPrice : version.annualPrice;
  const activePriceId = isMonthly ? version.stripePriceMonthlyID : version.stripePriceAnnualID;

  const calculateTotalPrice = (unitPrice, quantity, country) => {
    const basePriceInCents = Math.round(unitPrice * 100);
    const vatPerProduct =
      country === "Finland" ? Math.round(basePriceInCents * VAT_RATE) : 0;
    const totalPerProduct = basePriceInCents + vatPerProduct;
    const total = totalPerProduct * quantity;
    return {
      total,
      vatAmount: vatPerProduct * quantity,
    };
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10) || 1;
    setQuantity(newQuantity);

    if (country === "Finland") {
      const { total, vatAmount } = calculateTotalPrice(activePrice, newQuantity, country);
      setTotalPriceWithVAT(total / 100);
      setVATMessage(`Includes €${(vatAmount / 100).toFixed(2)} VAT`);
    } else {
      setTotalPriceWithVAT(Number(activePrice * newQuantity));
      setVATMessage("");
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    if (selectedCountry === "Finland") {
      const { total, vatAmount } = calculateTotalPrice(activePrice, quantity, selectedCountry);
      setTotalPriceWithVAT(total / 100);
      setVATMessage(`Includes €${(vatAmount / 100).toFixed(2)} VAT`);
    } else {
      setTotalPriceWithVAT(Number(activePrice * quantity));
      setVATMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData(event.target);

    const unitPrice = parseFloat(activePrice);
    if (isNaN(unitPrice)) {
      setErrors({ payment: "Invalid product price. Please try again." });
      setLoading(false);
      return;
    }

    const { total, vatAmount } = calculateTotalPrice(activePrice, quantity, country);
    const basicPriceInCents = Math.round(unitPrice * 100);

    formData.append("totalPriceInCents", total);
    formData.append("basicPriceInCents", basicPriceInCents);
    formData.append("vatAmount", vatAmount);
    formData.append("priceId", activePriceId);
    formData.append("orderId", uuidv4());
    formData.append("paymentMode", paymentMode);

    const payload = Object.fromEntries(formData.entries());

    try {
      const endpoint = isMonthly
        ? "/.netlify/functions/create-subscription"
        : "/.netlify/functions/create-payment-intent";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const { clientSecret, error } = await response.json();
      if (error) throw new Error(error);

      const cardElement = elements.getElement(CardNumberElement);
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.get("name"),
            email: formData.get("email"),
          },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      navigate("/success");
    } catch (err) {
      setErrors({ payment: err.message });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const { total } = calculateTotalPrice(activePrice, quantity, country);
    setTotalPriceWithVAT(total / 100);
  }, [activePrice, quantity, country]);

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mt-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-black">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          min="1"
          onChange={handleQuantityChange}
          className="w-20 border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="name" className="block text-sm font-medium text-black">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="title" className="block text-sm font-medium text-black">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="phone" className="block text-sm font-medium text-black">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-black">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="company" className="block text-sm font-medium text-black">
          Company Name
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="vat" className="block text-sm font-medium text-black">
          VAT ID / TAX ID
        </label>
        <input
          id="vat"
          name="vat"
          type="text"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="shipping" className="block text-sm font-medium text-black">
          Shipping Address
        </label>
        <input
          id="shipping"
          name="shipping"
          type="text"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="billing" className="block text-sm font-medium text-black">
          Billing Address
        </label>
        <input
          id="billing"
          name="billing"
          type="text"
          className="w-full border p-1 rounded"
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="country" className="block text-sm font-medium text-black">
          Country
        </label>
        <select
          id="country"
          name="country"
          onChange={handleCountryChange}
          className="w-full border p-1 rounded"
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {vatMessage && (
          <p className="text-gray-700 mt-1 text-sm">{vatMessage}</p>
        )}
      </div>

      {/* Card Information */}
      <div className="mt-4">
        <PaymentIcons />
        <div className="space-y-4">
          <div>
            <label htmlFor="card-number" className="block text-sm">
              Card Number
            </label>
            <CardNumberElement
              id="card-number"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="card-expiry" className="block text-sm">
                Expiry Date
              </label>
              <CardExpiryElement
                id="card-expiry"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="card-cvc" className="block text-sm">
                CVC
              </label>
              <CardCvcElement
                id="card-cvc"
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-brandorange"
      >
        {loading
          ? "Processing..."
          : country === "Finland"
          ? `${isMonthly ? "Subscribe" : "Buy Now"} (€${totalPriceWithVAT.toFixed(2)}${isMonthly ? "/mo" : ""} incl. VAT)`
          : `${isMonthly ? "Subscribe" : "Buy Now"} (€${totalPriceWithVAT.toFixed(2)}${isMonthly ? "/mo" : ""})`}
      </button>

      {errors.payment && <p className="text-red-500 mt-2">{errors.payment}</p>}
    </form>
  );
};

export default function ProductPage({ data }) {
  const version = data.strapiVersion;
  const productImage = getImage(version.productPicture.localFile.childImageSharp.gatsbyImageData);
  const productVariables = version.product_variables;
  const softwareItems = version.software_items;
  const testimonials = data.allStrapiTestimonial.nodes;
  const [paymentMode, setPaymentMode] = useState("annual");

  const hasMonthlyOption = version.monthlyPrice && version.stripePriceMonthlyID;
  const activePrice = paymentMode === "monthly" ? version.monthlyPrice : version.annualPrice;
  const activePriceLabel = paymentMode === "monthly" ? "/month" : "/year";

  return (
    <Layout>
      <Seo title={version.headline} description={version.versionDescription} />

      <div className="relative w-full min-h-[500px] h-[500px] bg-black flex items-center font-manrope">
        <div className="container mx-auto pl-6">
          <h1 className="text-3xl font-bold font-manrope text-white">
            {version.headline}
          </h1>
          <p className="text-lg font-manrope text-white mt-2">{version.versionDescription}</p>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-6 font-manrope">
        <div className="lg:w-1/3 w-full">
          <h2 className="text-2xl font-bold font-manrope text-blue-600">
            What You Get
          </h2>

          {/* Payment mode tabs */}
          {hasMonthlyOption && (
            <div className="mt-6 flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setPaymentMode("annual")}
                className={`flex-1 py-3 px-4 text-sm font-bold transition-colors ${
                  paymentMode === "annual"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                12 Month License
              </button>
              <button
                onClick={() => setPaymentMode("monthly")}
                className={`flex-1 py-3 px-4 text-sm font-bold transition-colors ${
                  paymentMode === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                Monthly Payment
              </button>
            </div>
          )}

          <div className="mt-8">
          <div className="mt-4">
            <GatsbyImage
              image={productImage}
              alt={version.headline}
              className="w-4/5 flext-start rounded-lg"
            />
            <ul className="mt-4">
              {softwareItems.map((item, index) => (
                <li key={index} className="flex flex-col mb-2">
                  <span className={`text-black ${index === 0 ? 'font-bold text-purple-800' : ''}`}>{item.headline}</span>
                  <div className="border-b-2 border-dotted border-grey-200 mt-1"></div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <ul className="mt-2">
              {productVariables.map((variable, index) => (
                <li key={index} className="flex flex-col mb-2">
                  {variable.link ? (
                    <a href={variable.link} target="_blank" rel="noopener noreferrer" className={`text-blue-600 hover:text-brandorange hover:underline ${index === 0 ? 'font-bold' : ''}`}>
                      {variable.name}
                    </a>
                  ) : (
                    <span className={`text-black ${index === 0 ? 'font-bold text-brandblue' : ''}`}>{variable.name}</span>
                  )}
                  <div className="border-b-2 border-dotted border-grey-200 mt-1"></div>
                </li>
              ))}
            </ul>
          </div>

            <div className="mt-10 text-black font-manrope">
              <h2 className="text-4xl font-bold text-blue-600 mb-4">
                €{activePrice}<span className="text-lg font-normal">{activePriceLabel}</span>
              </h2>
              <p className="text-brandblue mb-4">VAT not included</p>
              <p>
                See our <a href="/legal/terms/" className="text-blue-600 hover:underline hover:text-brandorange">Terms and conditions</a>
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 w-full">
          <Elements stripe={stripePromise}>
            <CheckoutForm version={version} paymentMode={paymentMode} />
          </Elements>
        </div>
        <div className="lg:w-1/3 w-full">
          <div className="grid grid-cols-1 gap-6">
            {testimonials.map((testimonial, index) => {
              const testimonialImage = getImage(testimonial.avatar.localFile.childImageSharp.gatsbyImageData);
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
                  <div className="flex items-start mb-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 mr-4">
                      {testimonialImage && (
                        <GatsbyImage
                          image={testimonialImage}
                          alt={testimonial.name}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    {/* Testimonial content */}
                    <div className="flex-1">
                      <p className="font-manrope text-black">
                        {testimonial.testimonialText}
                      </p>
                      <p className="font-manrope text-sm font-bold text-black mt-4">
                        {testimonial.name}
                      </p>
                      <a
                        href={testimonial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-manrope text-brandblue hover:text-brandorange"
                      >
                        {testimonial.title}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query($versionName: String!) {
    strapiVersion(versionName: { eq: $versionName }) {
      headline
      versionDescription
      stripePriceAnnualID
      annualPrice
      monthlyPrice
      stripePriceMonthlyID
      productPicture {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH, width: 350, height: 350)
          }
        }
      }
      versionName
      product_variables {
        name
        link
      }
      software_items {
        headline
      }
    }
    allStrapiTestimonial {
      nodes {
        name
        avatar {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        title
        testimonialText
        url
      }
    }
  }
`;