import React from "react"
import Markdown from "./markdown"

const RichText = ({ data }) => {
  // Early return if no data
  if (!data) return null

  const {
    content,
    textSize = "medium",
    textAlignment = "left",
    containerWidth = "medium",
    backgroundColor = "transparent",
    padding = "medium",
    enableDropCap = false,
    customCssClass
  } = data

  // Early return if no content
  if (!content?.data?.content) return null

  const textContent = content.data.content

  // Get background class
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'white': return 'bg-white'
      case 'light-gray': return 'bg-gray-50'
      case 'brand-light': return 'bg-orange-50'
      default: return 'bg-transparent'
    }
  }

  // Get padding class
  const getPaddingClass = () => {
    switch (padding) {
      case 'none': return 'py-0'
      case 'small': return 'py-6 sm:py-8'
      case 'large': return 'py-16 sm:py-20'
      default: return 'py-8 sm:py-12' // medium
    }
  }

  // Get text size class
  const getTextSizeClass = () => {
    switch (textSize) {
      case 'small': return 'text-sm sm:text-base'
      case 'large': return 'text-lg sm:text-xl'
      case 'extra-large': return 'text-xl sm:text-2xl'
      default: return 'text-base sm:text-lg' // medium
    }
  }

  // Get text alignment class
  const getTextAlignmentClass = () => {
    switch (textAlignment) {
      case 'center': return 'text-center'
      case 'right': return 'text-right'
      case 'justify': return 'text-justify'
      default: return 'text-left'
    }
  }

  // Get container width class
  const getContainerWidthClass = () => {
    switch (containerWidth) {
      case 'narrow': return 'max-w-2xl'
      case 'wide': return 'max-w-6xl'
      case 'full-width': return 'max-w-none'
      default: return 'container' // medium
    }
  }

  // Drop cap styles
  const getDropCapClass = () => {
    if (!enableDropCap) return ''
    return 'first-letter:text-7xl first-letter:font-bold first-letter:text-brandorange first-letter:float-left first-letter:line-height-1 first-letter:pr-2 first-letter:pt-1'
  }

  return (
    <div className={`${getBackgroundClass()} ${getPaddingClass()}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${getContainerWidthClass()} mx-auto`}>
          <div className={`
            ${getTextSizeClass()}
            ${getTextAlignmentClass()}
            font-manrope
            prose-lg
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
            prose-code:bg-gray-100
            prose-code:px-1
            prose-code:py-0.5
            prose-code:rounded
            prose-pre:bg-gray-900
            prose-pre:text-white
            ${getDropCapClass()}
            ${customCssClass || ''}
          `}>
            <Markdown className="w-full">
              {textContent}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RichText