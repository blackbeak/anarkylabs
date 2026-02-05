
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Check if this is the production environment
const isProduction = process.env.URL === 'https://anarkylabs.com' ||
                     process.env.DEPLOY_PRIME_URL === 'https://anarkylabs.com';

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Define a template for different post types
  const articlePage = path.resolve("./src/templates/article-post.js");
  const productPage = path.resolve("./src/templates/product.js");
  const legalPage = path.resolve("./src/templates/legal.js");
  const casePage = path.resolve("./src/templates/case.js");

  // GraphQL query to fetch all Strapi data
  const result = await graphql(`
    {
      allStrapiLegal {
        nodes {
          slug
        }
      }
      allStrapiArticle {
        nodes {
          slug
        }
      }
      allStrapiVersion {
        nodes {
          versionName
          publish
          publish_staging
        }
      }
      allStrapiCase {
        nodes {
          slug
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create pages for legal documents
  const legalPages = result.data.allStrapiLegal.nodes;
  legalPages.forEach((node) => {
    createPage({
      path: `/legal/${node.slug}`,
      component: legalPage,
      context: {
        slug: node.slug,
      },
    });
  });

  // Create pages for articles
  const articlePages = result.data.allStrapiArticle.nodes;
  articlePages.forEach((node) => {
    createPage({
      path: `/article/${node.slug}`,
      component: articlePage,
      context: {
        slug: node.slug,
      },
    });
  });

  // Create pages for products
  // Filter based on environment:
  // - Production: only create pages where publish is true
  // - Staging: create pages where publish OR publish_staging is true
  const productPages = result.data.allStrapiVersion.nodes.filter(node => {
    if (isProduction) {
      return node.publish === true;
    } else {
      // Staging: create page if either publish or publish_staging is true
      return node.publish === true || node.publish_staging === true;
    }
  });

  productPages.forEach((node) => {
    createPage({
      path: `/product/${node.versionName}`,
      component: productPage,
      context: {
        versionName: node.versionName,
      },
    });
  });

   // Create pages for cases
   const casePages = result.data.allStrapiCase.nodes;
   casePages.forEach((node) => {
     createPage({
       path: `/case/${node.slug}`,
       component: casePage,
       context: {
         slug: node.slug,
       },
     });
   });
};