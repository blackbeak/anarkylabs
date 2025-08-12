import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaLock } from "react-icons/fa";

const PaymentIcons = () => (
  <div className="flex items-center mb-2">
    <FaCcVisa className="w-8 h-8 mr-2 text-black" />
    <FaCcMastercard className="w-8 h-8 mr-2 text-black" />
    <FaCcAmex className="w-8 h-8 mr-2 text-black" />
    <FaLock className="w-8 h-8 ml-auto text-brandgold" />
  </div>
);

export default PaymentIcons;