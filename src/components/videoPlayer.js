import React, { useState } from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { getYouTubeEmbedUrl, getVimeoEmbedUrl } from "./utils"

const VideoPlayer = ({ 
  videoUrl, 
  facadeImage, 
  facadeImageAlt = "Video preview", 
  playButtonText = "See how it works",
  className = "",
  height = "h-[600px]",
  aspectRatio = "56.25%", // 16:9 aspect ratio by default
  maxWidth = "max-w-6xl", // Default max width
  centered = true // Center by default
}) => {
  const [showVideo, setShowVideo] = useState(false)
  
  // Convert video URL to proper embed format
  const getEmbedUrl = (url) => {
    if (!url) return null
    
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url)
    }
    
    // Check if it's a Vimeo URL
    if (url.includes('vimeo.com')) {
      return getVimeoEmbedUrl(url)
    }
    
    // If it's already an embed URL or direct video, return as-is
    return url
  }
  
  const embedUrl = getEmbedUrl(videoUrl)

  const containerClasses = `w-full ${maxWidth} ${centered ? 'mx-auto' : ''} ${className}`

  if (!embedUrl) {
    // If no video URL or invalid URL, just show the facade image
    return facadeImage ? (
      <div className={containerClasses}>
        <GatsbyImage
          image={facadeImage}
          alt={facadeImageAlt}
          className={`w-full ${height} rounded-lg`}
        />
      </div>
    ) : null
  }

  return (
    <div className={containerClasses}>
      {!showVideo ? (
        /* Video Facade with Play Button */
        <div className={`relative w-full ${height} rounded-lg cursor-pointer`}>
          {/* Facade Image */}
          {facadeImage && (
            <GatsbyImage
              image={facadeImage}
              alt={facadeImageAlt}
              className="w-full h-full rounded-lg"
              style={{ objectFit: "cover" }}
            />
          )}
          
          {/* Play Button Overlay */}
          <button
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg transition-opacity hover:opacity-80"
            aria-label={`Play video: ${playButtonText}`}
          >
            <div className="bg-black text-white hover:text-brandorange rounded-lg p-3 flex items-center justify-center">
              {/* Play Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-brandorange"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7 6v12l10-6z" />
              </svg>
              
              {/* Play Button Text */}
              <p className="text-white text-lg hover:text-brandorange font-manrope p-2">
                {playButtonText}
              </p>
            </div>
          </button>
        </div>
      ) : (
        /* Embedded Video */
        <div 
          className="relative w-full overflow-hidden rounded-lg" 
          style={{ paddingTop: aspectRatio }}
        >
          <iframe
            src={embedUrl}
            title="Embedded video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            style={{ borderRadius: "15px" }}
          />
        </div>
      )}
    </div>
  )
}

export default VideoPlayer