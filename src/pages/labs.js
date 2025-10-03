import React from "react"
import { graphql } from "gatsby"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"
import Hero from "../components/hero"
import ApiForm from "../components/apiform"
import { Seo } from "../components/seo"

const LabsPage = ({ data }) => {
  // Get Labs data
  const labs = data.strapiLab
 
  if (!labs) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SimpleHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Labs content not found</p>
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
      {labs.hero && (
        <Hero heroID={labs.hero.heroID} allHeroes={[labs.hero]} />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* Contact Form Section */}
        <section id="labsForm" className="bg-gray-50 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              
              {/* Form Headline */}
              {labs.formHeadline && (
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-gray-900">
                    {labs.formHeadline}
                  </h2>
                </div>
              )}

              {/* Form Description */}
              {labs.formDescription && (
                <div className="text-center mb-8">
                  <p className="text-lg sm:text-xl text-gray-600 font-manrope leading-relaxed">
                    {labs.formDescription}
                  </p>
                </div>
              )}

              {/* API Form */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <ApiForm 
                  formId="labsForm"/>
                </div>
              </div>
              
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  )
}

// Gatsby Head API for SEO
export const Head = ({ data }) => {
  const labs = data?.strapiLab
  const title = labs?.seoTitle || "Anarky Labs - Advanced Simulation Solutions"
  const description = labs?.seoDescription || "Home meta description"
  const shareImage = labs?.hero.backgroundMedia?.url || null

  return <Seo title={title} description={description} shareImage={shareImage} />
}

export const query = graphql`
  query {
    strapiLab {
      id
      formHeadline
      formDescription
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
    }
  }
`

export default LabsPage