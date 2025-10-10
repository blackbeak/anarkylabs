import React from 'react'
import { Link } from 'gatsby'
import ReactMarkdown from 'react-markdown'
import { BuyNowIcon, TalkToSalesIcon, StartTrialIcon } from './svg'

const CtaSection = ({ ctaData }) => {
  const {
    headline,
    description,
    ctaOneText,
    ctaOneSlug,
    ctaOne,
    ctaTwoText, 
    ctaTwoSlug,
    ctaTwo,
    ctaThreeText,
    ctaThreeSlug,
    ctaThree
  } = ctaData

  // Extract raw markdown content
  const getMarkdownContent = (richTextField) => {
    if (!richTextField) return null
    
    // Debug what we're actually getting
    console.log("Rich field structure:", richTextField)
    
    // Based on your GraphQL result, try different possible paths
    if (richTextField.data) {
      if (typeof richTextField.data === 'string') {
        return richTextField.data
      }
      if (richTextField.data.ctaOne) return richTextField.data.ctaOne
      if (richTextField.data.ctaTwo) return richTextField.data.ctaTwo  
      if (richTextField.data.ctaThree) return richTextField.data.ctaThree
    }
    
    if (typeof richTextField === 'string') {
      return richTextField
    }
    
    return null
  }

  const renderCTAButton = (text, slug, content, icon, index) => {
    const markdownContent = getMarkdownContent(content)
    
    if (!text || !slug) return null
    
    // Check if it's an external link
    const isExternal = slug.startsWith('http') || slug.startsWith('mailto:') || slug.startsWith('tel:')
    
    const buttonContent = (
      <>
        <div className="w-10 h-10 flex items-center justify-center mb-4 mx-auto text-center">
          <div className="text-brandorange">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3 font-manrope text-center">{text}</h3>
        {markdownContent && (
          <div className="text-gray-300 font-manrope text-sm leading-relaxed text-center">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        )}
      </>
    )
    
    const commonClasses = "bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 hover:scale-105 text-center block"
    
    return isExternal ? (
      <a 
        key={index}
        href={slug}
        className={commonClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {buttonContent}
      </a>
    ) : (
      <Link 
        key={index}
        to={slug}
        className={commonClasses}
      >
        {buttonContent}
      </Link>
    )
  }

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cyan-50 mb-4 font-manrope">{headline}</h2>
          <p className="text-gray-300 text-lg font-manrope max-w-2xl mx-auto">{description}</p>
        </div>

        {/* Three CTA boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {renderCTAButton(ctaOneText, ctaOneSlug, ctaOne, <BuyNowIcon />, 1)}
          {renderCTAButton(ctaTwoText, ctaTwoSlug, ctaTwo, <TalkToSalesIcon />, 2)}
          {renderCTAButton(ctaThreeText, ctaThreeSlug, ctaThree, <StartTrialIcon />, 3)}
        </div>

        {/* Bottom action buttons - removed at Sakari's request */}
        {/* <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          {ctaOneSlug && (
            <a 
              href={ctaOneSlug} 
              className="bg-brandblue hover:bg-brandorange text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-center transform hover:scale-105 shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <BuyNowIcon className="w-4 h-4" />
              {ctaOneText || 'Buy Now'}
            </a>
          )}
          {ctaTwoSlug && (
            <a 
              href={ctaTwoSlug}
              className="bg-brandblue hover:bg-brandorange text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-center transform hover:scale-105 shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <TalkToSalesIcon className="w-4 h-4" />
              {ctaTwoText || 'Contact Sales'}
            </a>
          )}
        </div> */}
      </div>
    </section>
  )
}

export default CtaSection