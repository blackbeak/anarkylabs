import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Quote = ({ data }) => {
  // Early return if no data
  if (!data) return null

  const {
    quoteText,
    personName,
    personTitle,
    companyName,
    companyUrl,
    headshot,
    quoteStyle = "standard",
    alignment = "center",
    backgroundColor = "transparent",
    showQuoteMarks = true
  } = data

  // Early return if no quote text
  if (!quoteText) return null

  // Get Gatsby image for headshot
  const headshotImage = headshot ? getImage(headshot?.localFile?.childImageSharp?.gatsbyImageData) : null

  // Get background color class
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'light-gray': return 'bg-gray-50'
      case 'brand-light': return 'bg-orange-50'
      case 'white': return 'bg-white shadow-sm'
      default: return 'bg-transparent'
    }
  }

  // Get alignment classes
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'text-left'
      case 'right': return 'text-right'
      default: return 'text-center'
    }
  }

  // Get quote style classes
  const getQuoteStyleClasses = () => {
    switch (quoteStyle) {
      case 'large':
        return {
          container: 'py-16 sm:py-20',
          quote: 'text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed',
          attribution: 'text-lg sm:text-xl mt-8'
        }
      case 'boxed':
        return {
          container: 'py-12 sm:py-16',
          quote: 'text-xl sm:text-2xl font-medium leading-relaxed border-l-4 border-brandorange pl-6',
          attribution: 'text-base sm:text-lg mt-6'
        }
      case 'minimal':
        return {
          container: 'py-8 sm:py-12',
          quote: 'text-lg sm:text-xl font-normal leading-relaxed',
          attribution: 'text-sm sm:text-base mt-4'
        }
      default: // standard
        return {
          container: 'py-12 sm:py-16',
          quote: 'text-xl sm:text-2xl font-medium leading-relaxed',
          attribution: 'text-base sm:text-lg mt-6'
        }
    }
  }

  const styleClasses = getQuoteStyleClasses()

  // Check if company URL is external
  const isExternalLink = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  }

  // Render company name with optional link
  const renderCompanyName = () => {
    if (!companyName) return null

    if (companyUrl) {
      if (isExternalLink(companyUrl)) {
        return (
          <a
            href={companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brandorange hover:text-brandred hover:underline transition-colors duration-200"
          >
            {companyName}
          </a>
        )
      } else {
        return (
          <a
            href={companyUrl}
            className="text-brandorange hover:text-brandred hover:underline transition-colors duration-200"
          >
            {companyName}
          </a>
        )
      }
    }

    return <span className="text-gray-600">{companyName}</span>
  }

  return (
    <div className={`${getBackgroundClass()} ${styleClasses.container}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto ${getAlignmentClass()}`}>
          {/* Quote Text */}
          <blockquote className={`${styleClasses.quote} font-manrope text-gray-900 relative`}>
            {showQuoteMarks && quoteStyle !== 'boxed' && (
              <span className="text-6xl sm:text-8xl text-brandorange opacity-20 absolute -top-4 -left-2 sm:-left-4 leading-none">
                "
              </span>
            )}
            <span className={showQuoteMarks && quoteStyle !== 'boxed' ? 'relative z-10' : ''}>
              {quoteText}
            </span>
            {showQuoteMarks && quoteStyle !== 'boxed' && (
              <span className="text-6xl sm:text-8xl text-brandorange opacity-20 absolute -bottom-8 -right-2 sm:-right-4 leading-none">
                "
              </span>
            )}
          </blockquote>

          {/* Attribution */}
          {(personName || personTitle || companyName || headshotImage) && (
            <div className={`${styleClasses.attribution} font-manrope`}>
              <div className={`flex items-center gap-4 ${
                alignment === 'center' ? 'justify-center' : 
                alignment === 'right' ? 'justify-end' : 
                'justify-start'
              }`}>
                {/* Headshot */}
                {headshotImage && (
                  <div className="flex-shrink-0">
                    <GatsbyImage
                      image={headshotImage}
                      alt={personName || "Quote attribution"}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    />
                  </div>
                )}

                {/* Text Attribution */}
                <div className={alignment === 'right' ? 'text-right' : 'text-left'}>
                  {personName && (
                    <div className="font-semibold text-gray-900">
                      {personName}
                    </div>
                  )}
                  
                  <div className="text-gray-600">
                    {personTitle && (
                      <>
                        <span>{personTitle}</span>
                        {companyName && <span className="mx-2">•</span>}
                      </>
                    )}
                    {renderCompanyName()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quote