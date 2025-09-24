import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const ArticleMedia = ({ data }) => {
  // Early return if no data
  if (!data) return null

  const {
    mediaType,
    image,
    videoUrl,
    caption,
    altText,
    alignment = "center",
    size = "medium",
    borderRadius = "medium",
    shadow = true
  } = data

  // Get Gatsby image
  const gatsbyImage = image ? getImage(image?.localFile?.childImageSharp?.gatsbyImageData) : null

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))((\w|-){11})(?:\S+)?/)
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null
  }

  // Get Vimeo embed URL
  const getVimeoEmbedUrl = (url) => {
    if (!url) return null
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(?:.*\/)?(\d+)/)
    return vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : null
  }

  // Get embed URL for video
  const getVideoEmbedUrl = (url) => {
    if (!url) return null
    return getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url) || url
  }

  // Get container alignment class
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'text-left'
      case 'right': return 'text-right ml-auto'
      case 'full-width': return 'w-full'
      default: return 'text-center mx-auto'
    }
  }

  // Get size classes
  const getSizeClass = () => {
    if (alignment === 'full-width') return 'w-full'
    
    switch (size) {
      case 'small': return 'max-w-sm'
      case 'large': return 'max-w-4xl'
      case 'full-width': return 'w-full'
      default: return 'max-w-2xl' // medium
    }
  }

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case 'none': return 'rounded-none'
      case 'small': return 'rounded-sm'
      case 'large': return 'rounded-xl'
      case 'full': return 'rounded-full'
      default: return 'rounded-lg' // medium
    }
  }

  // Get shadow class
  const getShadowClass = () => {
    return shadow ? 'shadow-lg hover:shadow-xl transition-shadow duration-300' : ''
  }

  // Container classes
  const containerClasses = `
    container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12
    ${getAlignmentClass()}
  `.trim()

  // Media classes
  const mediaClasses = `
    ${getSizeClass()}
    ${getBorderRadiusClass()}
    ${getShadowClass()}
    overflow-hidden
  `.trim()

  // Render image
  const renderImage = () => {
    if (gatsbyImage) {
      return (
        <GatsbyImage
          image={gatsbyImage}
          alt={altText || caption || "Article image"}
          className={mediaClasses}
        />
      )
    } else if (image?.url) {
      return (
        <img
          src={image.url}
          alt={altText || caption || "Article image"}
          className={`${mediaClasses} w-full h-auto`}
        />
      )
    }
    return null
  }

  // Render video
  const renderVideo = () => {
    const embedUrl = getVideoEmbedUrl(videoUrl)
    if (!embedUrl) return null

    // Calculate aspect ratio height
    const getVideoHeight = () => {
      if (alignment === 'full-width') return 'h-[50vh] sm:h-[60vh]'
      switch (size) {
        case 'small': return 'h-[200px]'
        case 'large': return 'h-[400px] sm:h-[500px]'
        case 'full-width': return 'h-[50vh] sm:h-[60vh]'
        default: return 'h-[300px] sm:h-[400px]' // medium
      }
    }

    return (
      <div className={`${mediaClasses} ${getVideoHeight()} relative`}>
        <iframe
          src={embedUrl}
          title={caption || "Article video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }

  // Main render
  return (
    <div className={containerClasses}>
      <div className={alignment === 'full-width' ? 'w-full' : getSizeClass()}>
        {mediaType === 'video-url' ? renderVideo() : renderImage()}
        
        {caption && (
          <p className="text-sm text-gray-600 font-manrope mt-3 italic text-center">
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}

export default ArticleMedia