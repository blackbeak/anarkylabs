import React from 'react';
import Layout from '../components/layout';
import { Seo } from '../components/seo';

const CancelPage = () => (
  <Layout>
    <Seo title="Payment failed" />
    <div className="relative w-full min-h-[250px] h-[250px] bg-black flex items-center font-manrope">
      <div className="container mx-auto lg:px-40 md:px-28 sm:px-6 text-left">
        <h1 className="text-3xl font-bold font-manrope text-white">
          Payment Failed
        </h1>
        <p className="text-lg font-manrope text-brandorange mt-2">
          Your payment was not processed.
        </p>
      </div>
    </div>
    <div className="container mx-auto px-6 py-12 flex flex-col items-center font-manrope">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-gray-700 mb-4">
          On this occasion your payment was not successful. Either the payment was declined or we cannot serve your country of origin.
        </p>
        <a href="/contact" className="text-brandorange hover:text-brandred hover:underline">
         Please contact us to book a time to discuss how we can help you.
        </a>
      </div>
    </div>
  </Layout>
);

export default CancelPage;