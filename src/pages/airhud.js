import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"
import Hero from "../components/hero"
import Benefits from "../components/benefits"
import FeatureCollections from "../components/featureCollections"
import CtaSection from "../components/ctaSection"
import VideoPlayer from "../components/videoPlayer"
import SelectedFAQ from "../components/selectedFaq"
import Markdown from "../components/markdown"
import { Seo } from "../components/seo"

const AirHUDPage = ({ data }) => {
  // Get AirHUD data
  const airHUD = data.strapiAirhud
  
  // Get all heroes for Hero component
  const allHeroes = data.allStrapiHero?.nodes || []
  
  // Get all CTA sections
  const allCtaSections = data.allStrapiCtaSection?.nodes || []
  
  // Get the specific CTA (you can change this ID based on what you set up in Strapi)
  const airHUDCta = allCtaSections.find(cta => cta.ctaID === "airhud") || allCtaSections.find(cta => cta.ctaID === "home")

  // Get system overview image
  const systemOverviewImage = airHUD?.systemOverview ? getImage(airHUD.systemOverview?.localFile?.childImageSharp?.gatsbyImageData) : null
  const bodyImage = airHUD?.hero?.backgroundMedia ? getImage(airHUD.hero.backgroundMedia?.localFile?.childImageSharp?.gatsbyImageData) : null
  const videoUrl = airHUD?.videoUrl || null
 
  // Get supported drones content
  const supportedDrones = airHUD?.supportedDrones?.data?.supportedDrones || null
 
  // Debug FAQ data
  //console.log("AirHUD FAQs:", airHUD?.faqs)
 
  if (!airHUD) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <SimpleHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">AirHUD content not found</p>
        </main>
        <SimpleFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SimpleHeader />

      {/* Hero Section - Uses hero relation */}
      {airHUD.hero && (
        <Hero heroID={airHUD.hero.heroID} allHeroes={allHeroes} />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* Benefits Section */}
        {(airHUD.benefitHeadline || airHUD.benefitText || (airHUD.benefits && airHUD.benefits.length > 0)) && (
          <Benefits 
            benefitHeadline={airHUD.benefitHeadline}
            benefitText={airHUD.benefitText}
            selectedBenefits={airHUD.benefits || []}
            backgroundColor="bg-white"
          />
        )}

        {/* Feature Collections - Alternating layout - Use AirHUD's selected feature collections */}
        {airHUD.feature_collections && airHUD.feature_collections.length > 0 && (
          <FeatureCollections 
            featureCollections={airHUD.feature_collections}
          />
        )}

        {/* Video Demo Section with Anchor */}
        {(airHUD.videoHeadline || videoUrl) && (
          <section id="demo" className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Demo Section Headline */}
              {airHUD.videoHeadline && (
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-gray-900">
                    {airHUD.videoHeadline}
                  </h2>
                </div>
              )}

              {/* Video Player */}
              {videoUrl && (
                <VideoPlayer 
                  videoUrl={videoUrl}
                  facadeImage={bodyImage}
                  facadeImageAlt={`${airHUD.benefitHeadline || 'AirHUD'} demonstration`}
                  playButtonText="Watch Demo"
                  maxWidth="container"
                />
              )}
              
            </div>
          </section>
        )}

        {/* SubHead One Section */}
        {airHUD.subHeadOne && (
          <section className="bg-white py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-gray-900 mb-8">
                  {airHUD.subHeadOne}
                </h2>
              </div>
            </div>
          </section>
        )}

        {/* System Overview Image Section */}
        {systemOverviewImage && (
          <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto text-center">
                <GatsbyImage
                  image={systemOverviewImage}
                  alt={airHUD.subHeadOne || "System Overview"}
                  className="w-full"
                />
              </div>
            </div>
          </section>
        )}

        {/* System Overview Image Fallback (if no Gatsby image) */}
        {!systemOverviewImage && airHUD.systemOverview?.url && (
          <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto text-center">
                <img
                  src={airHUD.systemOverview.url}
                  alt={airHUD.subHeadOne || "System Overview"}
                  className="w-full"
                />
              </div>
            </div>
          </section>
        )}

        {/* Supported Drones Section - NEW */}
        {supportedDrones && (
          <section className="bg-white py-12 sm:py-24">
            <div className="container mx-auto px-2 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <Markdown className="prose prose-lg mx-auto font-manrope">
                  {supportedDrones}
                </Markdown>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {airHUDCta && (
          <CtaSection ctaData={airHUDCta} />
        )}
       
        {/* FAQ Section - Fixed: Use correct field name and remove nested section */}
        {airHUD.subHeadTwo && airHUD.faqs && airHUD.faqs.length > 0 && (
          <SelectedFAQ 
            selectedFAQs={airHUD.faqs}
            sectionTitle={airHUD.subHeadTwo}
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
  const airhud = data?.strapiAirhud
  const title = airhud?.benefitHeadline || "Anarky Labs - Advanced XR Solutions for drone pilots"
  const description = airhud?.hero?.description || "Home meta description"
  const shareImage = airhud?.hero.backgroundMedia?.localFile?.publicURL || null

  return <Seo title={title} description={description} shareImage={shareImage} />
}



export const query = graphql`
  query {
    strapiAirhud {
      id
      subHeadOne
      subHeadTwo
      videoUrl
      videoHeadline
      benefitHeadline
      benefitText
      supportedDrones {
        data {
          supportedDrones
        }
      }
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
        textAlignment
        overlayEnabled
        overlayOpacity
      }
      faqs {
        id
        question
        answer
      }
      benefits {
        id
        benefitTitle
        benefitBody
        orderBy
      }
      feature_collections {
        id
        featureDescription
        featureImage {
          url
          localFile {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                width: 600
              )
            }
          }
        }
      }
      systemOverview {
        url
        localFile {
          childImageSharp {
            gatsbyImageData(
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
              width: 1200
            )
          }
        }
      }
    }
    allStrapiHero {
      nodes {
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
        textAlignment
        overlayEnabled
        overlayOpacity
      }
    }
    allStrapiCtaSection {
      nodes {
        id
        ctaID
        headline
        description
        ctaOne
        ctaTwo
        ctaThree
        ctaOneText
        ctaOneSlug
        ctaTwoText
        ctaTwoSlug
        ctaThreeText
        ctaThreeSlug
      }
    }
  }

`

export default AirHUDPage