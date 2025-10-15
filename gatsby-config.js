/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Check if this is the production domain
const isProduction = process.env.URL === 'https://anarkylabs.com' || 
                     process.env.DEPLOY_PRIME_URL === 'https://anarkylabs.com';

module.exports = {
  siteMetadata: {
    title: `Anarky Labs - Advanced Simulation Solutions`,
    description: `Professional simulation and training solutions for aviation, drone operations, and beyond. Cutting-edge technology for industry professionals.`,
    author: `@anarkylabs`,
    image: `https://energized-canvas-6b08f4eb08.media.strapiapp.com/anarky_labs_hero.jpg`,
    twitterUsername: `@anarkylabs`, 
    siteUrl: `https://anarkylabs.com`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Anarky Labs`,
        short_name: `AnarkylLabs`,
        start_url: `/`,
        background_color: `#383c5c`,
        icon: `src/images/AirSkill-icon.png`,
      },
    },
    
    // Sitemap - Only on production
    isProduction && {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [
          `/dev-404-page`,
          `/404`,
          `/404.html`,
          `/offline-plugin-app-shell-fallback`,
        ],
        resolveSiteUrl: () => `https://anarkylabs.com`,
        serialize: ({ path }) => {
          let priority = 0.7
          let changefreq = 'weekly'
          
          if (path === '/') {
            priority = 1.0
            changefreq = 'daily'
          }
          else if (path === '/airhud' || path === '/airskill') {
            priority = 0.9
            changefreq = 'weekly'
          }
          else if (path.startsWith('/article/') || path === '/blog') {
            priority = 0.8
            changefreq = 'weekly'
          }
          else if (path === '/contact' || path === '/support' || path === '/shop-index') {
            priority = 0.8
            changefreq = 'monthly'
          }
          
          return {
            url: path,
            changefreq,
            priority,
          }
        },
      },
    },
    
    // Robots.txt - Block indexing on staging
    !isProduction && {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{userAgent: '*', disallow: '/'}]
      }
    },
    
    // Robots.txt - Allow indexing on production
    isProduction && {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://anarkylabs.com',
        sitemap: 'https://anarkylabs.com/sitemap-index.xml',
        policy: [{userAgent: '*', allow: '/'}]
      }
    },
    
    // Strapi Source Plugin
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: "https://energized-canvas-6b08f4eb08.strapiapp.com/",
        accessToken: process.env.STRAPI_ACCESS_TOKEN,
        collectionTypes: [
          {
            singularName: "article",
            queryParams: {
              publicationState: process.env.GATSBY_IS_PREVIEW === "true" ? "preview" : "live",
              populate: {
                author: "*",
                seoFeatureImage: "*", 
                categories: "*",
                articles: {
                  populate: "*"
                }
              }
            },
          },
          {
            singularName: "legal",
          },
          {
            singularName: "hero",
          },
          {
            singularName: "page-collection",
          },
          {
            singularName: "cta-section",
          },
          {
            singularName: "version",
          },
          {
            singularName: "reference-logo",
          },
          {
            singularName: "target",
          },
          {
            singularName: "case",
          },
          {
            singularName: "case-collection",
          },
          {
            singularName: "category",
          },
          {
            singularName: "testimonial",
          },
          {
            singularName: "feature-collection",
            queryParams: {
              populate: "*",
            }
          },
          {
            singularName: "tech-collection",
            queryParams: {
              populate: "*",
            }
          },
          {
            singularName: "author",
            queryParams: {
              populate: "*",
            }
          },
          {
            singularName: "faq",
          },
          {
            singularName: "user",
          },
          {
            singularName: "benefit",
          },
          {
            singularName: "scenario",
          },
          {
            singularName: "training-kit",
          },
          {
            singularName: "white-paper",
          },
          {
            singularName: "softwareItem",
          },
          {
            singularName: "form",
            queryParams: {
              populate: "*",
            }
          },
        ],
        singleTypes: [
          {
            singularName: "home",
          },
          {
            singularName: "about",
          },
          {
            singularName: "index",
          },
          {
            singularName: "airskill",
          },
          {
            singularName: "airhud",
          },
          {
            singularName: "lab",
          },
          {
            singularName: "pricing",
          },
          {
            singularName: "contact",
          },
          {
            singularName: "trial",
          },
          {
            singularName: "faq-home",
          },
          {
            singularName: "support",
          },
          {
            singularName: "blog",
          },
          {
            singularName: "features",
          },
          {
            singularName: "footer",
          },
        ],
      },
    },
  ].filter(Boolean), // Remove any false values from conditional plugins
};