/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import "./src/styles/global.css";


// Fathom Analytics SPA route tracking
export const onRouteUpdate = ({ location }) => {
  if (window.fathom) {
    window.fathom.trackPageview();
  }
};