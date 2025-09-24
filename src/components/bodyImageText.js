import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Markdown from "./markdown"

const BodyImageText = ({ data }) => {
  // Early return if no data
  if (!data) return null

  const {
    image,
    imagePosition = "left",
    textContent,
    altText,
    imageSize = "medium",
    verticalAlignment = "top",
    backgroundColor = "transparent",
    spacing = "normal",
    borderRadius = "medium",
    imageShadow = false
  } = data

  // Early return if missing required content
  if (!image || !textContent?.data?.textContent) return null

  const text = textContent.data.textContent

  // Get Gatsby image
  const gatsbyImage = image ? getImage(image?.localFile?.childImageSharp?.gatsbyImageData) : null

  // Get background class
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'white': return 'bg-white'
      case 'light-gray': return 'bg-gray-50'
      case 'brand-light': return 'bg-orange-50'
      default: return 'bg-transparent'
    }
  }

  // Get spacing/padding class
  const getSpacingClass = () => {
    switch (spacing) {
      case 'tight': return 'py-8 sm:py-10'
      case 'loose': return 'py-16 sm:py-20'
      default: return 'py-12 sm:py-16' // normal
    }
  }

  // Get image size classes
  const getImageSizeClass = () => {
    switch (imageSize) {
      case 'small': return 'w-full lg:w-1/4'
      case 'large': return 'w-full lg:w-2/3'
      default: return 'w-full lg:w-1/2' // medium
    }
  }

  // Get text size class (complement to image)
  const getTextSizeClass = () => {
    switch (imageSize) {
      case 'small': return 'w-full lg:w-3/4'
      case 'large': return 'w-full lg:w-1/3'
      default: return 'w-full lg:w-1/2' // medium
    }
  }

  // Get vertical alignment class
  const getVerticalAlignmentClass = () => {
    switch (verticalAlignment) {
      case 'center': return 'items-center'
      case 'bottom': return 'items-end'
      default: return 'items-start' // top
    }
  }

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case 'none': return 'rounded-none'
      case 'small': return 'rounded-sm'
      case 'large': return 'rounded-xl'
      default: return 'rounded-lg' // medium
    }
  }

  // Get shadow class
  const getShadowClass = () => {
    return imageShadow ? 'shadow-lg hover:shadow-xl transition-shadow duration-300' : ''
  }

  // Get flex direction based on image position
  const getFlexDirectionClass = () => {
    return imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
  }

  // Get gap class based on spacing
  const getGapClass = () => {
    switch (spacing) {
      case 'tight': return 'gap-6 lg:gap-8'
      case 'loose': return 'gap-10 lg:gap-16'
      default: return 'gap-8 lg:gap-12' // normal
    }
  }

  // Image classes
  const imageClasses = `
    ${getImageSizeClass()}
    ${getBorderRadiusClass()}
    ${getShadowClass()}
    overflow-hidden
  `.trim()

  // Text content classes
  const textClasses = `
    ${getTextSizeClass()}
    prose prose-lg max-w-none
    prose-headings:font-manrope
    prose-headings:text-gray-900
    prose-p:text-gray-800
    prose-p:leading-relaxed
    prose-a:text-brandorange
    prose-a:hover:text-brandred
    prose-a:transition-colors
    prose-a:duration-200
    prose-strong:text-gray-900
    prose-ul:list-disc
    prose-ol:list-decimal
    prose-blockquote:border-l-4
    prose-blockquote:border-brandorange
    prose-blockquote:bg-gray-50
    prose-blockquote:py-2
    prose-blockquote:px-4
    prose-blockquote:italic
    font-manrope
  `.trim()

  // Container classes
  const containerClasses = `
    ${getBackgroundClass()}
    ${getSpacingClass()}
  `.trim()

  // Render image
  const renderImage = () => {
    // DEBUG: Let's see what image data we have
    console.log("=== BodyImageText Debug ===")
    console.log("Raw image prop:", image)
    console.log("GatsbyImage result:", gatsbyImage)
    console.log("Image URL:", image?.url)
    
    // Try GatsbyImage first, fall back to direct URL if it fails
    if (gatsbyImage) {
      console.log("Attempting GatsbyImage")
      return (
        <div className={imageClasses}>
          <GatsbyImage
            image={gatsbyImage}
            alt={altText || "Article image"}
            className="w-full h-auto"
            objectFit="cover"
            loading="eager"
          />
        </div>
      )
    } else if (image?.url) {
      console.log("Falling back to direct Strapi URL:", image.url)
      return (
        <div className={imageClasses}>
          <img
            src={image.url}
            alt={altText || "Article image"}
            className="w-full h-auto object-cover"
          />
          <p className="text-xs text-gray-500 mt-2">Fallback URL: {image.url}</p>
        </div>
      )
    } else {
      console.log("No valid image data found")
      return (
        <div className={imageClasses} style={{ backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <span>No Image Data</span>
        </div>
      )
    }
  }

  return (
    <div className={containerClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${getFlexDirectionClass()} ${getGapClass()} ${getVerticalAlignmentClass()}`}>
          {/* Image */}
          {renderImage()}

          {/* Text Content */}
          <div className={textClasses}>
            <Markdown className="w-full">
              {text}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyImageText