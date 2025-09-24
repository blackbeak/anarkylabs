import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Seo } from "../components/seo"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa"

// Import the new article components
import ArticleHero from "../components/articleHero"
import ArticleMedia from "../components/articleMedia" 
import Quote from "../components/quote"
import RichText from "../components/richText"
import BodyImageText from "../components/bodyImageText"

// Add Page Head component and pass in SEO variables from GraphQL
export const Head = ({ data }) => {
  const seoTitle = data.strapiArticle.seoTitle
  const seoSummary = data.strapiArticle.seoSummary
  const seoFeatureImage = data.strapiArticle.seoFeatureImage?.url

  return <Seo title={seoTitle} description={seoSummary} shareImage={seoFeatureImage} />
}

export default function articlePage({ data }) {
  const article = data.strapiArticle

  // DEBUG: Let's see what data we're getting
  console.log("Full article data:", article)
  console.log("Articles array:", article.articles)
  console.log("Articles length:", article.articles?.length)
  
  if (article.articles) {
    article.articles.forEach((component, index) => {
      console.log(`Component ${index}:`, component.__typename, component)
    })
  }

  // Component renderer function
  const renderComponent = (component, index) => {
    if (!component) return null

    switch (component.__typename) {
      case 'STRAPI__COMPONENT_ARTICLES_HERO':
        return <ArticleHero key={index} data={component} />
      
      case 'STRAPI__COMPONENT_ARTICLES_ARTICLE_MEDIA':
        return <ArticleMedia key={index} data={component} />
      
      case 'STRAPI__COMPONENT_ARTICLES_QUOTE':
        return <Quote key={index} data={component} />
      
      case 'STRAPI__COMPONENT_ARTICLES_RICH_TEXT':
        return <RichText key={index} data={component} />
      
      case 'STRAPI__COMPONENT_ARTICLES_BODY_IMAGE_TEXT':
        return <BodyImageText key={index} data={component} />
      
      default:
        console.warn(`Unknown component type: ${component.__typename}`)
        return null
    }
  }

  // Author information (keep existing author section)
  const author = article.author
  const authorHeadshot = author?.headshot ? getImage(author.headshot.localFile.childImageSharp.gatsbyImageData) : null

  return (
    <Layout>
      {/* Dynamic Article Components */}
      {article.articles && article.articles.length > 0 ? (
        <div className="article-components">
          {article.articles.map((component, index) => renderComponent(component, index))}
        </div>
      ) : (
        /* Fallback: Show message if no components exist */
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold font-manrope text-gray-900 mb-4">
            {article.seoTitle}
          </h1>
          <p className="text-lg font-manrope text-gray-600">
            This article is using the legacy format. Please add article components in Strapi.
          </p>
        </div>
      )}

      {/* Author Section - Keep existing styling */}
      {author && (
        <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-6 items-start bg-orange-50 rounded-lg shadow-lg">
          {/* Left-hand side: Author's Headshot */}
          {authorHeadshot && (
            <div className="w-24 h-24 lg:w-32 lg:h-32">
              <GatsbyImage 
                image={authorHeadshot} 
                alt={author.name} 
                className="rounded-full object-cover" 
              />
            </div>
          )}

          {/* Right-hand side: Author's Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold font-manrope">{author.name}</h3>
            <p className="text-lg font-manrope text-gray-600">{author.title}</p>
            <p className="mt-4 text-gray-800 font-manrope">{author.bio}</p>

            {/* Icons for contact information */}
            <div className="flex space-x-4 mt-4">
              {author.email && (
                <a href={`mailto:${author.email}`} className="text-gray-700 hover:text-brandred">
                  <FaEnvelope size={24} />
                </a>
              )}
              {author.telephone && (
                <a href={`tel:${author.telephone}`} className="text-gray-700 hover:text-brandred">
                  <FaPhone size={24} />
                </a>
              )}
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-brandred">
                  <FaLinkedin size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

// Updated GraphQL Query
export const query = graphql`
  query ($slug: String) {
    strapiArticle(slug: { eq: $slug }) {
      # Dynamic Zone Components
      articles {
        __typename
        ... on STRAPI__COMPONENT_ARTICLES_HERO {
          id
          headline
          description
          backgroundType
          backgroundImage {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          backgroundVideoUrl
          customColor
          customGradient
          textAlignment
          ctaOneText
          ctaOneLink
          ctaTwoText
          ctaTwoLink
          overlayOpacity
          minHeight
        }
        
        ... on STRAPI__COMPONENT_ARTICLES_ARTICLE_MEDIA {
          id
          mediaType
          image {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
            url
          }
          videoUrl
          caption
          altText
          alignment
          size
          borderRadius
          shadow
        }
        
        ... on STRAPI__COMPONENT_ARTICLES_QUOTE {
          id
          quoteText
          personName
          personTitle
          companyName
          companyUrl
          headshot {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          quoteStyle
          alignment
          backgroundColor
          showQuoteMarks
        }
        
        ... on STRAPI__COMPONENT_ARTICLES_RICH_TEXT {
          id
          content {
            data {
              content
            }
          }
          textSize
          textAlignment
          containerWidth
          backgroundColor
          padding
          enableDropCap
          customCssClass
        }
        
        ... on STRAPI__COMPONENT_ARTICLES_BODY_IMAGE_TEXT {
          id
          image {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
            url
          }
          imagePosition
          textContent {
            data {
              textContent
            }
          }
          altText
          imageSize
          verticalAlignment
          backgroundColor
          spacing
          borderRadius
          imageShadow
        }
      }
      
      # Keep existing fields for SEO and author
      seoTitle
      seoSummary
      slug
      seoFeatureImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
        url
      }
      author {
        bio
        email
        headshot {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        linkedin
        name
        telephone
        title
      }
      categories {
        name
        slug
      }
    }
  }
`