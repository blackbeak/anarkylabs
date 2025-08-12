// Ensure this export is PascalCase
import React from "react";
import { useSiteMetadata } from "../hooks/use-site-metadata";

export const Seo = ({ title, url, description, shareImage, children }) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
    image: defaultImage,
    twitterUsername,
    author,
  } = useSiteMetadata();

  // Ensure the image URL is absolute by prepending the site URL if necessary
  const imageUrl = shareImage?.startsWith('http') ? shareImage : `${siteUrl}${shareImage}`;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    author,
    image: imageUrl || defaultImage,
    url: url || siteUrl,
    twitterUsername,
  };

  return (
    <>
      <title>{seo.title} | AirSkill by Anarky Labs Oy</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="author" content={seo.author} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:author" content={seo.author} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content={seo.twitterUsername} />
      <link rel="icon" href="https://energized-canvas-6b08f4eb08.media.strapiapp.com/airskill_icon_c49e641ae1.png" />
      {children}
    </>
  );
};