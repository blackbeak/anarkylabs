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
        icon: `src/images/AirSkill-icon.png`, // Update this icon later
      },
    },
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
              queryParams: {
                populate: "*",
              }
            },
          },
          {
            singularName: "legal",
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
          // Add the new home page
          {
            singularName: "home",
          },
          // Keep existing for future product sections
          {
            singularName: "about",
          },
          {
            singularName: "index",
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
  ],
};