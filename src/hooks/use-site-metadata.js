import { graphql, useStaticQuery } from "gatsby"

export const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          author
          description
          twitterUsername
          image
          siteUrl
        }
      }
    }
  `)
  
  const defaultImage = data.site.siteMetadata.image
  const shareImage = defaultImage

  return {
    ...data.site.siteMetadata,
    shareImage,
  }
}

// Put in the article shareimage query later