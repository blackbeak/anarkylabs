import React, { useState } from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ScenarioCarousel = ({ scenarios }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? scenarios.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === scenarios.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentScenario = scenarios[currentIndex];
  const scenarioImage = getImage(currentScenario.scenarioImage.localFile.childImageSharp.gatsbyImageData);

  return (
    <div className="container mx-auto px-6 lg:w-9/12 w-full">
      {/* Headline */}
      <h2 className="text-center text-2xl font-bold font-manrope text-white mb-4">
        Scenarios developed with first responders
      </h2>

      {/* Arrows for mobile screens (Positioned below the headline) */}
      <div className="flex lg:hidden justify-center space-x-48 mb-4">
        <button onClick={handlePrev} className="text-2xl text-white">
          <FaArrowLeft />
        </button>
        <button onClick={handleNext} className="text-2xl text-white">
          <FaArrowRight />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6 w-full">
        {/* Arrows for large screens (Positioned beside the image and text) */}
        <button
          onClick={handlePrev}
          className="hidden lg:flex text-2xl text-white"
        >
          <FaArrowLeft />
        </button>

        {/* Image + Text */}
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 w-full">
          {/* Scenario Image */}
          <div className="lg:w-1/3 w-full">
            {scenarioImage && (
              <GatsbyImage
                image={scenarioImage}
                alt={currentScenario.name}
                style={{ objectFit: "cover", height: "100%" }}
                className="w-full h-full rounded-lg"
              />
            )}
          </div>

          {/* Scenario Text */}
          <div className="lg:w-2/3 w-full text-center lg:text-left">
            <h3 className="text-xl font-bold font-manrope text-white">
              {currentScenario.name}
            </h3>
            <p className="font-manrope text-white mt-2">
              {currentScenario.shortDesc}
            </p>
          </div>
        </div>

        {/* Next Arrow for large screens */}
        <button
          onClick={handleNext}
          className="hidden lg:flex text-2xl text-white"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ScenarioCarousel;