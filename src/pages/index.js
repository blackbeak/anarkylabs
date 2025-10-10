import React from "react"
import { graphql } from "gatsby"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"
import { Seo } from "../components/seo"
import Hero from "../components/hero"
import PageCollection from "../components/pageCollection"
import LogoCarousel from "../components/logoCarousel"
import BlogSection from "../components/blogSection"
import CtaSection from "../components/ctaSection"
import { HandshakeIconPro } from "../components/svg"

const HomePage = ({ data }) => {
  // Hero data
  const allHeroes = data.allStrapiHero?.nodes || []

  // PageCollection data
  const allPageCollections = data.allStrapiPageCollection?.nodes || []
  
  // Logo data
  const allLogos = data.allStrapiReferenceLogo?.nodes || []

  // for section headlines
  const home = data.strapiHome

  // for articles
   const featuredArticles = home?.articles || []
  
 // for CTA section
   const allCtaSections = data.allStrapiCtaSection?.nodes || []
  
  // Find specific collections by ID
  const airHudCollection = allPageCollections.find(p => p.collectionID === "airhud")
  const airSkillCollection = allPageCollections.find(p => p.collectionID === "airskill")
  const homeCta = allCtaSections.find(cta => cta.ctaID === "home")

  // Debug - check what collections we found
  // console.log("All collections:", allPageCollections.map(p => p.collectionID))
  // console.log("AirHUD found:", !!airHudCollection)
  // console.log("AirSkill found:", !!airSkillCollection)
  // console.log("Logos found:", allLogos.length)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SimpleHeader />

      {/* Hero Section - Component selects hero by ID */}
      <Hero heroID="home" allHeroes={allHeroes} />

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* AirHUD Section - PageCollection Component */}
        {airHudCollection && (
          <PageCollection 
            collectionData={airHudCollection}
          />
        )}

        {/* AirSkill Section - PageCollection Component */}
        {airSkillCollection && (
          <PageCollection 
            collectionData={airSkillCollection}
          />
        )}

        <div className="flex justify-center mb-4">
          <HandshakeIconPro className="w-8 h-8 text-brandblue" />
        </div>
        {/* Logo Carousel - Manual navigation only */}
        {allLogos.length > 0 && (
          <section className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Headline */}
              {home?.sectionHeadline && (
                <div className="text-center pb-8">
                  <h2 className="text-2xl sm:text-3xl font-manrope font-bold text-gray-900">
                    {home.sectionHeadline}
                  </h2>
                </div>
              )}
            </div>
             
            <LogoCarousel 
              logos={allLogos}
              variant="white"
            />
          </section>
        )}

        {/* CTA Section */}
        {homeCta && (
          <CtaSection ctaData={homeCta} />
        )}
        
        {/* Featured Articles Section */}
        <BlogSection 
          articles={featuredArticles}
          sectionTitle={home?.sectionHeadlineTwo}
          maxArticles={6}
        />
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  )
}

// Gatsby Head API for SEO
export const Head = ({ data }) => {
  const home = data?.strapiHome
  const title = home?.title || "Anarky Labs - Advanced Simulation Solutions"
  const description = home?.description || "Home meta description"
  const shareImage = home?.hero.backgroundMedia?.localFile?.publicURL || null

  return <Seo title={title} description={description} shareImage={shareImage} />
}

export const query = graphql`
  query {
    strapiHome {
      id
      title
      description
      sectionHeadline
      sectionHeadlineTwo
      articles {
          id
          seoTitle
          seoSummary
          slug
          seoFeatureImage {
            localFile {
              publicURL
            }
          }
        }
      hero {
        id
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
        
        overlayEnabled
        overlayOpacity
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
        overlayEnabled
        overlayOpacity
        textAlignment
      }
    }
    allStrapiPageCollection {
      nodes {
        id
        collectionID
        headline
        description
        ctaOneText
        ctaOneLink
        ctaTwoText
        ctaTwoLink
        styleVariant
        textAlignment
        customGradient
        customBackgroundColor
        collectionImage {
          url
          localFile {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                width: 400
              )
            }
          }
        }
      }
    }
    allStrapiReferenceLogo {
      nodes {
        id
        url
        logo {
          url
          localFile {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
                width: 200
                height: 100
              )
            }
          }
        }
      }
    }
    allStrapiCtaSection {
      nodes {
        id
        ctaID
        headline
        description
        ctaOneText
        ctaOneSlug
        ctaOne
        ctaTwoText
        ctaTwoSlug
        ctaTwo 
        ctaTwoText
        ctaTwoSlug
        ctaThreeText
        ctaThreeSlug
        ctaThree 
      }
    }
  }
`

export default HomePage
           