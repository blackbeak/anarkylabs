import React from "react";
import Reactmarkdown from "react-markdown";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

// Add Page Head component and pass in SEO variables from GraphQL
export const Head = ({ data }) => {
  const title = data.strapiAbout.title;
  const description = data.strapiAbout.headline;
  return <Seo title={title} description={description} />;
};

export default function LegalPage({ data }) {
  const about = data.strapiAbout;

  // Gracefully handle the image - check if the image, localFile, and childImageSharp exist
  const headerImage = getImage(about.heroImage.localFile.childImageSharp.gatsbyImageData);
  const bodyImage = getImage(about.bodyImage.localFile.childImageSharp.gatsbyImageData); // Use bodyImage field correctly
  const headline = about.headline;
  const bodyText = about.body.data.body;

  return (
    <Layout>
      {/* Header section */}
      <div className="relative w-full min-h-[500px] h-[500px]">
        {/* Render header image with limited height or fallback */}
        {headerImage ? (
          <GatsbyImage
            image={headerImage}
            alt="Header Image"
            className="absolute inset-0 h-[500px] w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 z-0"></div> // Placeholder if no image
        )}

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle, rgba(56, 60, 92, 0.7) 0%, rgba(0, 0, 0, 0.9) 70%)',
          }}
        ></div>

        {/* Headline inside a container aligned to the left */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold font-manrope text-white">
              {headline}
            </h1>
          </div>
        </div>
      </div>

      {/* Body content with image alongside text */}
      <div className="container mx-auto px-6 pb-6 pt-6 space-y-4 font-manrope prose-md flex flex-col lg:flex-row lg:space-x-6">
        {/* Body Image */}
        {bodyImage && (
          <div className="lg:w-1/2">
            <GatsbyImage 
              image={bodyImage} 
              alt="Body Image" 
              className="w-full rounded-2xl" 
            />
          </div>
        )}

        {/* Body Text */}
        <div className="lg:w-1/2 prose">
          <Reactmarkdown>{bodyText}</Reactmarkdown>
        </div>
      </div>
    </Layout>
  );
}

// Query from Strapi - cycle based on slug
export const query = graphql`
  query aboutQuery {
    strapiAbout {
      body {
        data {
          body
        }
      }
      heroImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      bodyImage { 
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      headline
      title
    }
  }
`;