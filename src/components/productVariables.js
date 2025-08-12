import React, { useState } from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

const ProductVariables = ({ kitImage, trainingKitHeadline, productVariables }) => {
  const [showDescription, setShowDescription] = useState({});

  const toggleDescription = (index) => {
    setShowDescription((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="container m-auto px-6 py-12 bg-white flex flex-col lg:flex-row gap-6">
      {/* Left-hand side: Kit Image */}
      <div className="lg:w-1/3">
        {kitImage && (
          <GatsbyImage
            image={kitImage}
            alt="Training Kit Image"
            className="w-full h-auto rounded-lg"
            imgStyle={{ borderRadius: "15px" }} // Maintain rounded corners
            style={{ objectFit: "cover" }} // Ensure the image is sharp
          />
        )}
      </div>

      {/* Right-hand side: Product Variables */}
      <div className="lg:w-2/3 w-full">
        <h2 className="text-3xl font-bold font-manrope text-black mb-4">
          {trainingKitHeadline}
        </h2>
        <div className="space-y-4">
          {productVariables && productVariables.map((variable, index) => (
            <div key={index} className="border border-gray-300 rounded-lg">
              <button
                className="w-full text-left px-4 py-2 font-bold font-manrope text-black bg-gray-50 rounded-t-lg flex justify-between items-center"
                onClick={() => toggleDescription(index)}
              >
                {variable.name}
                <span className="text-xl">
                  {showDescription[index] ? "-" : "+"}
                </span>
              </button>
              {showDescription[index] && (
                <div className="px-4 py-2 font-manrope text-black bg-white rounded-b-lg">
                  {variable.description}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Shop Now Button */}
        <div className="mt-6 flex justify-end">
          <Link
            to="/product/starter-kit-with-dji-controller-offer/"
            className="inline-block px-6 py-3 text-white bg-brandblue border border-brandblue rounded-md font-bold hover:bg-brandorange hover:border-brandorange hover:text-white transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductVariables;