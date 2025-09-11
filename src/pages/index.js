import React from "react"
import { graphql } from "gatsby"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"
import Hero from "../components/hero"
import PageCollection from "../components/pageCollection"

const HomePage = ({ data }) => {
  // Hero data
  const allHeroes = data.allStrapiHero?.nodes || []

  // PageCollection data
  const allPageCollections = data.allStrapiPageCollection?.nodes || []
  
  // Find specific page collections by collectionID
  const airHudCollection = allPageCollections.find(p => p.collectionID === "airhud")
  const airSkillCollection = allPageCollections.find(p => p.collectionID === "airskill")

  // Debug - check what collections we found
  // console.log("All collections:", allPageCollections.map(p => p.collectionID))
  // console.log("AirHUD found:", !!airHudCollection)
  // console.log("AirSkill found:", !!airSkillCollection)

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
        
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  )
}

// Gatsby Head API for SEO
export const Head = ({ data }) => {
  const home = data?.strapiHome
  
  return (
    <>
      <title>{home?.title || "Anarky Labs - Advanced Simulation Solutions"}</title>
      <meta name="description" content={home?.description || "Professional simulation and training solutions for aviation, drone operations, and beyond."} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  )
}

export const query = graphql`
  query {
    strapiHome {
      id
      title
      description
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
  }
`

export default HomePage