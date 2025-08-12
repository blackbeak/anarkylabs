import React, { useEffect } from 'react';
import Layout from '../components/layout';
import { Seo } from '../components/seo';

const SuccessPage = () => {
  useEffect(() => {
    if (window.fathom) {
      window.fathom.trackEvent('Purchase'); // Make sure this matches your Fathom goal/event setup
    }
  }, []);

  return (
    <Layout>
      <Seo title="Payment Successful" />
      <div className="relative w-full min-h-[250px] h-[250px] bg-black flex items-center font-manrope">
        <div className="container mx-auto lg:px-40 md:px-28 sm:px-6 text-left">
          <h1 className="text-3xl font-bold font-manrope text-white">
            Payment Successful!
          </h1>
          <p className="text-lg font-manrope text-brandorange mt-2">
            Thank you for your purchase!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col items-center font-manrope">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-gray-700 mb-4">
            Your payment was successful. We appreciate your business!
          </p>
          <a href="/" className="text-brandorange hover:text-brandred hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;