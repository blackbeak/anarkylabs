import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Markdown from "./markdown"

const FeatureCollections = ({ featureCollections = [], className = "" }) => {
  if (!featureCollections || featureCollections.length === 0) {
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      {featureCollections.map((feature, index) => {
        // Alternate layout: even index = image left, odd index = image right
        const isImageLeft = index % 2 === 0
        
        const {
          featureDescription,
          featureImage
        } = feature

        // Get Gatsby image
        const featureGatsbyImage = featureImage ? getImage(featureImage?.localFile?.childImageSharp?.gatsbyImageData) : null

        // Define styles
        const containerClass = "bg-white"
        const textClass = "text-gray-900"

        return (
          <section key={feature.id || index} className={`${containerClass} py-16 sm:py-24`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}>
                
                {/* Image Column */}
                <div className={`w-full lg:w-1/2 ${isImageLeft ? 'lg:flex lg:justify-start' : 'lg:flex lg:justify-end'}`}>
                  {featureGatsbyImage ? (
                    <GatsbyImage
                      image={featureGatsbyImage}
                      alt=""
                      className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-lg"
                    />
                ) : null}
                </div>

                {/* Content Column */}
                <div className="w-full lg:w-1/2">
                  <div className="text-left">
                    
                    {/* Feature Description */}
                    {featureDescription && (
                      <Markdown className={`${textClass} font-manrope text-base sm:text-lg lg:text-xl leading-relaxed`}>
                        {featureDescription}
                      </Markdown>
                    )}
                    
                  </div>
                </div>

              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default FeatureCollections