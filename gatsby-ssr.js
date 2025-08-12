import React from "react";

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  // Set the lang attribute for the entire website
  setHtmlAttributes({ lang: `en` });

  // Add the Fathom Analytics tracking script and Google site verification meta tag
  setHeadComponents([
    <script
      key="fathom"
      src="https://cdn.usefathom.com/script.js"
      data-site="SNBRALHC"
      defer
    />,
    <meta
      key="google-site-verification"
      name="google-site-verification"
      content="R3PmZPiGfXE9FYunxnldGtEt9-TSBaDmFEtPYJHhtYI"
    />,
  ]);
};