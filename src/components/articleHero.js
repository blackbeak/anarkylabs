import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const ArticleHero = ({ data }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Extract data safely before any conditional logic
  const {
    headline,
    description,
    backgroundType = "gradient-dark",
    backgroundImage,
    backgroundVideoUrl,
    customColor,
    customGradient,
    textAlignment = "center",
    ctaOneText,
    ctaOneLink,
    ctaTwoText,
    ctaTwoLink,
    overlayOpacity = 40,
    minHeight = "medium"
  } = data || {}

  // Get Gatsby image
  const backgroundGatsbyImage = backgroundImage ? getImage(backgroundImage?.localFile?.childImageSharp?.gatsbyImageData) : null

  // Parse video service URLs (reuse logic from existing hero.js)
  function getVideoEmbedData(videoUrl) {
    if (!videoUrl) return null

    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const youtubeMatch = videoUrl.match(youtubeRegex)
    
    if (youtubeMatch) {
      return {
        type: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${youtubeMatch[1]}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`
      }
    }

    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
    const vimeoMatch = videoUrl.match(vimeoRegex)
    
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1&controls=0&title=0&byline=0&portrait=0`
      }
    }

    // Direct video file URLs
    if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return {
        type: 'direct',
        url: videoUrl
      }
    }

    return null
  }

  const videoData = getVideoEmbedData(backgroundVideoUrl)

  // useEffect MUST be called before any early returns
  useEffect(() => {
    if (backgroundType === 'video-url' && videoData) {
      const timer = setTimeout(() => setIsVideoLoaded(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [backgroundType, videoData])

  // Early return AFTER all hooks
  if (!data) return null

  // Get height classes
  const getHeightClass = () => {
    switch (minHeight) {
      case 'small': return 'min-h-[40vh]'
      case 'large': return 'min-h-[80vh]'
      case 'full': return 'min-h-screen'
      default: return 'min-h-[60vh]' // medium
    }
  }

  // Get text alignment classes
  const getTextAlignmentClass = () => {
    switch (textAlignment) {
      case 'left': return 'text-left'
      case 'right': return 'text-right'
      default: return 'text-center'
    }
  }

  // Get background styles
  const getBackgroundStyle = () => {
    if (customGradient) return { background: customGradient }
    if (customColor) return { backgroundColor: customColor }
    
    switch (backgroundType) {
      case 'gradient-dark': return { background: 'linear-gradient(to bottom, #000000, #4B5563)' }
      case 'gradient-light': return { background: 'linear-gradient(to bottom, #4B5563, #ffffff)' }
      case 'gradient-brand': return { background: 'linear-gradient(to bottom right, var(--color-brandblue), var(--color-brandorange))' }
      case 'solid-color': return { backgroundColor: '#383c5c' }
      default: return {}
    }
  }

  // Check if links are external
  const isExternalLink = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  }

  const renderCTA = (text, link) => {
    if (!text || !link) return null

    const ctaProps = {
      className: "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-brandorange text-white hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-manrope"
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

  const renderSecondaryCTA = (text, link) => {
    if (!text || !link) return null

    const ctaProps = {
      className: "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white hover:text-brandblue transition-all duration-300 transform hover:scale-105 font-manrope backdrop-blur-sm"
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

  const renderBackground = () => {
    switch (backgroundType) {
      case 'video-url':
        if (!videoData) return null
        return (
          <div className="absolute inset-0 z-0">
            {!isVideoLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-brandblue to-brandorange animate-pulse" />
            )}
            
            <iframe
              src={videoData.embedUrl}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '140vw',
                height: '78.75vw',
                minHeight: '140vh',
                minWidth: '248.88vh',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Article hero background video"
            />
            
            <div 
              className="absolute inset-0 bg-black z-10" 
              style={{ opacity: overlayOpacity / 100 }}
            />
          </div>
        )

      case 'image':
        return (
          <div className="absolute inset-0 z-0">
            {backgroundGatsbyImage ? (
              <GatsbyImage
                image={backgroundGatsbyImage}
                alt={headline || "Article hero background"}
                className="w-full h-full"
                style={{ 
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%"
                }}
                objectFit="cover"
              />
            ) : null}
            <div 
              className="absolute inset-0 bg-black z-10" 
              style={{ opacity: overlayOpacity / 100 }}
            />
          </div>
        )

      default:
        return <div className="absolute inset-0 z-0" style={getBackgroundStyle()} />
    }
  }

  return (
    <section className={`relative py-8 sm:py-16 ${getHeightClass()} flex items-center overflow-hidden`}>
      {renderBackground()}

      <div className="relative z-20 w-full">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getTextAlignmentClass()}`}>
          {headline && (
            <h1 className="text-2xl md:text-6xl font-bold text-white font-manrope drop-shadow-lg">
              {headline}
            </h1>
          )}
          
          {description && (
            <p className={`text-lg sm:text-xl mt-4 leading-relaxed text-white opacity-90 font-manrope drop-shadow-md max-w-3xl ${
              textAlignment === 'center' ? 'mx-auto' : 
              textAlignment === 'right' ? 'ml-auto' : 
              ''
            }`}>
              {description}
            </p>
          )}

          {(ctaOneText || ctaTwoText) && (
            <div className={`flex flex-col sm:flex-row gap-4 mt-8 ${
              textAlignment === 'left' ? 'justify-start' : 
              textAlignment === 'right' ? 'justify-end' : 
              'justify-center'
            }`}>
              {renderCTA(ctaOneText, ctaOneLink)}
              {renderSecondaryCTA(ctaTwoText, ctaTwoLink)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ArticleHero