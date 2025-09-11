import React, { useState, useEffect, useCallback } from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const LogoCarousel = ({ 
  logos = [], 
  variant = "white", // "white" or "dark"
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [logosPerView, setLogosPerView] = useState(5)

  // Update logos per view based on window size
    const updateLogosPerView = useCallback(() => {
    if (typeof window === 'undefined') return
    const newLogosPerView = window.innerWidth >= 1024 ? 5 : 2
    setLogosPerView(newLogosPerView)
        
    // Reset currentIndex if it's out of bounds
    const maxIndex = Math.max(0, logos.length - newLogosPerView)
    setCurrentIndex(prev => prev > maxIndex ? 0 : prev)
    }, [logos.length])

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
    updateLogosPerView()
  }, [updateLogosPerView])

  // Listen for window resize
  useEffect(() => {
  if (!isMounted) return

  const handleResize = () => {
    updateLogosPerView()
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [isMounted, updateLogosPerView])

  // Style variants
  const getVariantStyles = () => {
    const variants = {
      white: {
        containerClass: "bg-white",
        textClass: "text-gray-900"
      },
      dark: {
        containerClass: "bg-gray-900",
        textClass: "text-white"
      }
    }
    return variants[variant] || variants.white
  }

  const styles = getVariantStyles()

  // Render logo image - simplified, no SVG detection
  const renderLogoImage = (logoData, index, isLink = false) => {
    const logoImage = getImage(logoData.logo?.localFile?.childImageSharp?.gatsbyImageData)
    
    const grayscaleClasses = isLink ? 
      'filter grayscale group-hover:grayscale-0' : 
      'filter grayscale hover:grayscale-0'

    // Fixed dimensions for all logos
    const logoStyle = {
      width: '160px',
      height: '80px',
      objectFit: 'contain'
    }

    if (logoImage) {
      // Use GatsbyImage for optimized images
      return (
        <GatsbyImage
          image={logoImage}
          alt={`Partner logo ${index + 1}`}
          className={`transition-all duration-300 ${grayscaleClasses}`}
          style={logoStyle}
          objectFit="contain"
        />
      )
    } else if (logoData.logo?.url) {
      // Fallback to direct URL for any image type
      return (
        <img
          src={logoData.logo.url}
          alt={`Partner logo ${index + 1}`}
          className={`transition-all duration-300 ${grayscaleClasses}`}
          style={logoStyle}
        />
      )
    } else {
      // Placeholder
      return (
        <div 
          className="bg-gray-300 rounded flex items-center justify-center"
          style={logoStyle}
        >
          <span className="text-gray-500 text-sm">Logo</span>
        </div>
      )
    }
  }

  // Don't render if no logos
  if (!logos || logos.length === 0) {
    return null
  }

  return (
    <div className={`${styles.containerClass} py-12 sm:py-16 w-full ${className}`}>
      {/* Use same container structure as header/footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Arrow Navigation - Above logos */}
        {isMounted && logos.length > logosPerView && (
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <button
              onClick={() => setCurrentIndex(prev => {
                const maxIndex = Math.max(0, logos.length - logosPerView)
                return prev <= 0 ? maxIndex : prev - 1
              })}
              aria-label="Previous logos"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                variant === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-black/10 hover:bg-black/20 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentIndex(prev => {
                const maxIndex = Math.max(0, logos.length - logosPerView)
                return prev >= maxIndex ? 0 : prev + 1
              })}
              aria-label="Next logos"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                variant === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-black/10 hover:bg-black/20 text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          
          {/* Logo Track */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / logosPerView)}%)`
            }}
          >
            {logos.map((logoData, index) => {
              return (
                <div
                  key={logoData.id || index}
                  className="flex-shrink-0 w-1/2 lg:w-1/5 p-4"
                >
                  {/* Fixed container for consistent spacing */}
                  <div 
                    className="flex items-center justify-center"
                    style={{ height: '100px' }} // 80px + 20px padding
                  >
                    {logoData.url ? (
                      <a
                        href={logoData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center group transition-all duration-300 hover:scale-105"
                      >
                        {renderLogoImage(logoData, index, true)}
                      </a>
                    ) : (
                      <div className="flex items-center justify-center transition-all duration-300 hover:scale-105">
                        {renderLogoImage(logoData, index, false)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Arrow Navigation (only show if mounted and multiple pages) */}
          {isMounted && logos.length > logosPerView && (
            <>
              {/* Previous Arrow - Desktop only */}
              <button
                onClick={() => setCurrentIndex(prev => {
                  const maxIndex = Math.max(0, logos.length - logosPerView)
                  return prev <= 0 ? maxIndex : prev - 1
                })}
                aria-label="Previous logos"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 hidden lg:flex ${
                  variant === 'dark' 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Next Arrow - Desktop only */}
              <button
                onClick={() => setCurrentIndex(prev => {
                  const maxIndex = Math.max(0, logos.length - logosPerView)
                  return prev >= maxIndex ? 0 : prev + 1
                })}
                aria-label="Next logos"
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 hidden lg:flex ${
                  variant === 'dark' 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LogoCarousel