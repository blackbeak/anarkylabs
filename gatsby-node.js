
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});


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
  const productPages = result.data.allStrapiVersion.nodes;
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