import React, { useState } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"
import Hero from "../components/hero"
import SelectedFAQ from "../components/selectedFaq"
import ApiForm from "../components/apiform"

const SupportPage = ({ data }) => {
  // Get Support data
  const support = data.strapiSupport
  
  // Get white papers
  const whitePapers = support?.white_papers || []
  
  // Track which white paper's form is showing
  const [activeFormIndex, setActiveFormIndex] = useState(null)
  // Track which forms have been submitted successfully
  const [submittedForms, setSubmittedForms] = useState(new Set())

  if (!support) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SimpleHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Support content not found</p>
        </main>
        <SimpleFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SimpleHeader />

      {/* Hero Section - Uses hero relation directly */}
      {support.hero && (
        <Hero heroID={support.hero.heroID} allHeroes={[support.hero]} />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* White Papers Section */}
        {whitePapers.length > 0 && (
          <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Section Headline */}
              {support.whitePaperHeadline && (
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-gray-900">
                    {support.whitePaperHeadline}
                  </h2>
                </div>
              )}

              {/* White Papers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {whitePapers.map((paper, index) => {
                  const paperImage = paper.whitePaperImage ? getImage(paper.whitePaperImage?.localFile?.childImageSharp?.gatsbyImageData) : null
                  const showForm = activeFormIndex === index
                  const isSubmitted = submittedForms.has(index)
                  
                  return (
                    <div key={paper.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                      
                      {/* Image */}
                        <div className="w-full h-80 bg-gray-100 flex-shrink-0 items-center justify-center overflow-hidden rounded-t-lg">
                        {paperImage ? (
                           <GatsbyImage
                            image={paperImage}
                            alt={paper.whitePaperTitle || "White paper"}
                            className="w-full h-full object-cover"
                          />
                        ) : paper.whitePaperImage?.url ? (
                            <img
                            src={paper.whitePaperImage.url}
                            alt={paper.whitePaperTitle || "White paper"}
                            className="w-full h-full object-cover"
                            />
                        ) : null}
                        </div>

                      {/* Content */}
                      <div className="p-8 flex-1 flex flex-col">
                        {paper.whitePaperTitle && (
                          <h3 className="text-xl font-bold font-manrope text-gray-900 mb-4">
                            {paper.whitePaperTitle}
                          </h3>
                        )}
                        
                        {paper.whitePaperDescription && (
                          <p className="text-gray-600 font-manrope mb-6 leading-relaxed flex-1">
                            {paper.whitePaperDescription}
                          </p>
                        )}

                        {/* Show form, download button, or download link based on state */}
                        {!showForm && !isSubmitted ? (
                          // Initial state - show button with text from form
                          <button
                            onClick={() => setActiveFormIndex(index)}
                            className="inline-block w-full text-center px-6 py-3 bg-brandblue hover:bg-brandorange text-white font-manrope font-semibold rounded-lg transition-colors duration-300"
                          >
                            {paper.form?.buttonText || "Get Free Download"}
                          </button>
                        ) : isSubmitted ? (
                          // After successful submission - show download link
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <p className="text-green-700 font-manrope font-semibold mb-3">
                              Thank you! Your download is ready.
                            </p>
                            {paper.whitePaperFile?.localFile?.publicURL && (
                              <a
                                href={paper.whitePaperFile.localFile.publicURL}
                                download
                                className="inline-block w-full px-6 py-3 bg-brandblue hover:bg-brandorange text-white font-manrope font-semibold rounded-lg transition-colors duration-300"
                              >
                                Download PDF Now
                              </a>
                            )}
                          </div>
                        ) : (
                          // Form is active - show the form
                          <div className="mt-4">
                            {paper.form && (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <ApiForm 
                                  formId={paper.form.title}
                                  onSuccess={() => {
                                    // Mark this form as submitted
                                    setSubmittedForms(prev => new Set([...prev, index]))
                                    // Hide the form
                                    setActiveFormIndex(null)
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {support.faqHeadline && support.faqs && support.faqs.length > 0 && (
          <SelectedFAQ 
            selectedFAQs={support.faqs}
            sectionTitle={support.faqHeadline}
            showTitle={true}
            backgroundColor="bg-gray-50"
          />
        )}

      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  )
}

// Gatsby Head API for SEO
export const Head = ({ data }) => {
  const support = data?.strapiSupport
  
  return (
    <>
      <title>{support?.seoTitle || "Support - Documentation & Downloads"}</title>
      <meta name="description" content={support?.seoDescription || "Access documentation, white papers, and support resources for Anarky Labs products."} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  )
}

export const query = graphql`
  query {
    strapiSupport {
      id
      whitePaperHeadline
      faqHeadline
      seoTitle
      seoDescription
      hero {
        id
        heroID
        headline
        description
        ctaOneText
        ctaOneLink
        ctaTwoText
        ctaTwoLink
        backgroundMedia {
          url
          mime
          localFile {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                width: 1920
                height: 1080
              )
            }
          }
        }
        backgroundVideo
      }
      white_papers {
        id
        whitePaperTitle
        whitePaperDescription
        whitePaperImage {
          url
          localFile {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                width: 600
                height: 480
              )
            }
          }
        }
        whitePaperFile {
          localFile {
            publicURL
          }
        }
        form {
          id
          title
          buttonText
          successMessage
          errorMessage
          endpoint
          field {
            name
            label
            placeholder
            type
            required
            order
            value
          }
        }
      }
      faqs {
        id
        question
        answer
      }
    }
  }
`

export default SupportPage