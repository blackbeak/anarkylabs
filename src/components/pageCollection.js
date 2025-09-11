import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const PageCollection = ({ collectionData, className = "" }) => {
  if (!collectionData) {
    return null
  }

  const {
    headline,
    description,
    ctaOneText,
    ctaOneLink,
    ctaTwoText,
    ctaTwoLink,
    collectionImage,
    // Styling fields from Strapi
    styleVariant = "gradient-dark",     // Controlled in Strapi
    textAlignment = "center",           // Controlled in Strapi
    customGradient,                     // Optional override
    customBackgroundColor              // Optional override
  } = collectionData

  // Get Gatsby image
  const collectionGatsbyImage = collectionImage ? getImage(collectionImage?.localFile?.childImageSharp?.gatsbyImageData) : null

  // Predefined style variants (safe, tested combinations)
  const getVariantStyles = () => {
    const variants = {
      "gradient-dark": {
        containerClass: "bg-gradient-to-b from-black to-gray-600",
        textClass: "text-white",
        ctaClass: "bg-white hover:bg-brandorange text-black"
      },
      "gradient-light": {
        containerClass: "bg-gradient-to-b from-gray-600 to-white",
        textClass: "text-stone-700", 
        ctaClass: "bg-black hover:bg-brandorange text-white"
      },
      "gradient-brand": {
        containerClass: "bg-gradient-to-br from-brandblue to-brandorange",
        textClass: "text-white",
        ctaClass: "bg-white hover:bg-brandblue text-brandorange"
      },
      "solid-white": {
        containerClass: "bg-white",
        textClass: "text-gray-900",
        ctaClass: "bg-brandorange hover:bg-brandblue text-white"
      },
      "solid-dark": {
        containerClass: "bg-gray-900",
        textClass: "text-white",
        ctaClass: "bg-brandorange hover:bg-white text-white hover:text-gray-900"
      },
      "image-overlay": {
        containerClass: "relative bg-gray-900",
        textClass: "text-white",
        ctaClass: "bg-brandorange hover:bg-white text-white hover:text-gray-900",
        hasImageOverlay: true
      }
    }

    // Use custom background if provided, otherwise use variant
    const baseVariant = variants[styleVariant] || variants["gradient-dark"]
    
    if (customGradient) {
      baseVariant.containerClass = customGradient
    } else if (customBackgroundColor) {
      baseVariant.containerClass = customBackgroundColor
    }

    return baseVariant
  }

  const styles = getVariantStyles()

  // Container alignment using same pattern as header/footer
  const getContainerAlignment = (alignment) => {
    switch (alignment) {
      case 'left':
        return "text-left justify-start"
      case 'right':
        return "text-right justify-end"
      default: // center
        return "text-center justify-center"
    }
  }

  // Content width constraints based on alignment
  const getContentWidth = (alignment) => {
    switch (alignment) {
      case 'left':
      case 'right':
        return "max-w-2xl" // Constrained width for readability
      default: // center
        return "max-w-4xl mx-auto" // Wider centered content
    }
  }

  // Image alignment classes
  const getImageAlignment = (alignment) => {
    switch (alignment) {
      case 'left':
        return "mx-0"
      case 'right':
        return "ml-auto"
      default: // center
        return "mx-auto"
    }
  }

  // Get alignment classes
  const containerAlignClass = getContainerAlignment(textAlignment)
  const contentWidthClass = getContentWidth(textAlignment)
  const imageAlignClass = getImageAlignment(textAlignment)

  // Check if links are external
  const isExternalLink = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  }

  const renderCTA = (text, link, ctaClass) => {
    if (!text || !link) return null

    const ctaProps = {
      className: `inline-block ${ctaClass} px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-manrope font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl`
    }

    if (isExternalLink(link)) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          {...ctaProps}
        >
          {text}
        </a>
      )
    } else {
      return (
        <Link to={link} {...ctaProps}>
          {text}
        </Link>
      )
    }
  }

  return (
    <div className={`${styles.containerClass} py-16 sm:py-24 w-full ${className} ${styles.hasImageOverlay ? 'relative' : ''}`}>
      
      {/* Background Image Overlay (if using image-overlay variant) */}
      {styles.hasImageOverlay && collectionGatsbyImage && (
        <>
          <GatsbyImage
            image={collectionGatsbyImage}
            alt={headline || "Background"}
            className="absolute inset-0 w-full h-full"
            style={{ 
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </>
      )}

      {/* Use same container structure as header/footer */}
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${styles.hasImageOverlay ? 'relative z-10' : ''}`}>
        
        {/* Content alignment container */}
        <div className={`flex ${containerAlignClass}`}>
          <div className={contentWidthClass}>
            
            {/* Collection Image (only show if NOT using as background overlay) */}
            {!styles.hasImageOverlay && collectionGatsbyImage && (
              <div className={`mb-4 sm:mb-6`}>
                <GatsbyImage
                  image={collectionGatsbyImage}
                  alt={headline || "Collection image"}
                  style={{width: '280px', maxWidth: '90vw', height: 'auto'}}
                  className={`sm:!w-[400px] ${imageAlignClass}`}
                />
              </div>
            )}

            {/* Collection Image (fallback to URL if not using as background overlay) */}
            {!styles.hasImageOverlay && !collectionGatsbyImage && collectionImage?.url && (
              <div className={`mb-4 sm:mb-6`}>
                <img
                  src={collectionImage.url}
                  alt={headline || "Collection image"}
                  style={{width: '280px', maxWidth: '90vw', height: 'auto'}}
                  className={`sm:!w-[400px] ${imageAlignClass}`}
                />
              </div>
            )}

            {/* Headline */}
            {headline && (
              <h2 className={`text-2xl sm:text-3xl font-manrope font-bold ${styles.textClass} mb-4 sm:mb-6`}>
                {headline}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className={`${styles.textClass} font-manrope text-base sm:text-xl mb-6 sm:mb-10 leading-relaxed`}>
                {description}
              </p>
            )}

            {/* CTAs */}
            <div className={`flex flex-col sm:flex-row gap-4 ${containerAlignClass.includes('justify-start') ? 'justify-start' : containerAlignClass.includes('justify-end') ? 'justify-end' : 'justify-center'}`}>
              {renderCTA(ctaOneText, ctaOneLink, styles.ctaClass)}
              {ctaTwoText && ctaTwoLink && renderCTA(ctaTwoText, ctaTwoLink, `border-2 border-current ${styles.textClass} hover:bg-current hover:text-brandorange`)}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageCollection