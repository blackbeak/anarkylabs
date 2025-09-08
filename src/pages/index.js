import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"

const HomePage = ({ data }) => {
  const home = data.strapiHome
  const heroImageOne = getImage(home?.heroImageOne?.localFile?.childImageSharp?.gatsbyImageData)
  const heroImageTwo = getImage(home?.heroImageTwo?.localFile?.childImageSharp?.gatsbyImageData)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SimpleHeader />

      {/* Headline Section */}
      <section className="bg-black py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-6xl font-bold text-cyan-50">
            {home?.headline || "Advanced Simulation Solutions"}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        
        {/* CTA 1 - AirHUD (Black Background - Full Width) */}
        <div className="bg-gradient-to-b from-black to-gray-600 py-16 sm:py-24 flex items-center justify-center w-full">
          <div className="text-center font-manrope max-w-7xl mx-auto px-4 sm:px-10">
            {/* Hero Image One */}
            {heroImageOne && (
              <div style={{textAlign: 'center', marginBottom: '16px'}} className="sm:mb-6">
                <GatsbyImage
                  image={heroImageOne}
                  alt={home.AirHUDHeadline || "AirHUD"}
                  style={{width: '280px', maxWidth: '90vw', height: 'auto', margin: '0 auto'}}
                  className="sm:!w-[400px]"
                />
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-manrope font-bold text-white mb-4 sm:mb-6">
              {home?.AirHUDHeadline || "AirHUD"}
            </h2>
            <p className="text-white font-manrope text-base sm:text-xl mb-6 sm:mb-10 leading-relaxed">
              {home?.AirHUDDescription || "Professional heads-up display solutions for aviation and industrial applications."}
            </p>
            <a
              href={home?.AirHUDSlug || "https://airhud.io"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white hover:bg-brandorange text-black px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-manrope font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {home?.AirHUDCtaText || "Learn More"}
            </a>
          </div>
        </div>

        {/* CTA 2 - AirSkill (White Background - Full Width) */}
        <div className="bg-gradient-to-b from-gray-600 to-white py-16 sm:py-24 flex items-center justify-center w-full">
          <div className="text-center max-w-7xl mx-auto px-4 sm:px-10">
            {/* Hero Image Two */}
            {heroImageTwo && (
              <div style={{textAlign: 'center', marginBottom: '16px'}} className="sm:mb-6">
                <GatsbyImage
                  image={heroImageTwo}
                  alt={home.AirSkillHeadline || "AirSkill"}
                  style={{width: '280px', maxWidth: '90vw', height: 'auto', margin: '0 auto'}}
                  className="sm:!w-[400px]"
                />
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-manrope font-bold text-stone-700 mb-4 sm:mb-6">
              {home?.AirSkillHeadline || "AirSkill"}
            </h2>
            <p className="text-stone-700 font-manrope text-base sm:text-xl mb-6 sm:mb-10 leading-relaxed">
              {home?.AirSkillDescription || "Professional VR drone pilot training simulator with industry-specific scenarios."}
            </p>
            <a
              href={home?.AirSkillSlug || "https://airskill.io"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black hover:bg-brandorange text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-manrope font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {home?.AirSkillCtaText || "Try Now"}
            </a>
          </div>
        </div>
        
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
      <meta name="description" content="Professional simulation and training solutions for aviation, drone operations, and beyond." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  )
}

export const query = graphql`
  query {
    strapiHome {
      id
      title
      headline
      AirSkillHeadline
      AirSkillDescription
      AirSkillCtaText
      AirSkillSlug
      AirHUDHeadline
      AirHUDDescription
      AirHUDCtaText
      AirHUDSlug
      heroImageOne {
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
      heroImageTwo {
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
`

export default HomePage