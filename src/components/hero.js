import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Hero = ({ heroID, allHeroes = [] }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Find the hero by ID from the passed collection
  const heroData = allHeroes.find(hero => hero.heroID === heroID)

  // Get video data safely
  const videoData = heroData ? getVideoEmbedData(heroData.backgroundVideo) : null

  // Determine background type safely
  const backgroundType = heroData ? getBackgroundType(heroData, videoData) : 'gradient'

  // useEffect MUST be called before any early returns
  useEffect(() => {
    if (backgroundType === 'video-service') {
      const timer = setTimeout(() => setIsVideoLoaded(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [backgroundType])

  // Early returns AFTER all hooks
  if (!heroID || !allHeroes.length || !heroData) {
    return null
  }

  const {
    headline,
    description,
    ctaOneText,
    ctaOneLink,
    ctaTwoText,
    ctaTwoLink,
    backgroundMedia
  } = heroData

  // Get Gatsby image
  const backgroundGatsbyImage = backgroundMedia ? getImage(backgroundMedia?.localFile?.childImageSharp?.gatsbyImageData) : null

  // Parse video service URLs
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

  // Determine background type
  function getBackgroundType(data, videoInfo) {
    if (videoInfo) return 'video-service'
    if (data.backgroundMedia?.mime?.startsWith('video/') || data.backgroundMedia?.url?.match(/\.(mp4|webm|ogg)$/i)) return 'video-direct'
    if (data.backgroundMedia) return 'image'
    return 'gradient'
  }

  const renderBackground = () => {
    switch (backgroundType) {
      case 'video-service':
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
                width: '140vw',        // Much larger viewing window
                height: '78.75vw',     // Proportional height (140 * 0.5625)
                minHeight: '140vh',    // Larger depth
                minWidth: '248.88vh',  // Proportional width (140 / 0.5625)
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Hero background video"
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
          </div>
        )

      case 'video-direct':
        return (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src={backgroundMedia.url}
              onLoadedData={() => setIsVideoLoaded(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        )

      case 'image':
        return (
          <div className="absolute inset-0 z-0">
            {backgroundGatsbyImage ? (
              <GatsbyImage
                image={backgroundGatsbyImage}
                alt={headline || "Hero background"}
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
            ) : backgroundMedia?.url ? (
              <img
                src={backgroundMedia.url}
                alt={headline || "Hero background"}
                className="w-full h-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>
        )

      default:
        return <div className="absolute inset-0 z-0 bg-black" />
    }
  }

  return (
    <section className="relative py-8 sm:py-16 min-h-[80vh] flex items-center overflow-hidden">
      {renderBackground()}

      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {headline && (
            <h1 className="text-2xl md:text-6xl font-bold text-white font-manrope drop-shadow-lg">
              {headline}
            </h1>
          )}
          
          {description && (
            <p className="text-lg sm:text-xl mt-4 leading-relaxed text-white opacity-90 font-manrope drop-shadow-md max-w-3xl mx-auto">
              {description}
            </p>
          )}

          {(ctaOneText || ctaTwoText) && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              {ctaOneText && ctaOneLink && (
                <Link
                  to={ctaOneLink}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-brandorange text-white hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-manrope"
                >
                  {ctaOneText}
                </Link>
              )}
              
              {ctaTwoText && ctaTwoLink && (
                <Link
                  to={ctaTwoLink}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white text-white hover:bg-white hover:text-brandblue transition-all duration-300 transform hover:scale-105 font-manrope backdrop-blur-sm"
                >
                  {ctaTwoText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero