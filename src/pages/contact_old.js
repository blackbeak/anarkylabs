import React from "react";
import Markdown from "../components/markdown";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import ContactForm from "../components/contactForm";

// Add Page Head component and pass in SEO variables from GraphQL
export const Head = ({ data }) => {
  const title = data.strapiContact.headline;
  const description = data.strapiContact.summary;
  return <Seo title={title} description={description} />;
};

export default function ContactPage({ data }) {
  const contact = data.strapiContact;

  // Gracefully handle the image - check if the image, localFile, and childImageSharp exist
  const headerImage = getImage(contact.heroImage.localFile.childImageSharp.gatsbyImageData);
  const headline = contact.headline;
  const bodyText = contact.body.data.body;

  return (
    <Layout>
      {/* Header section */}
      <div className="relative w-full min-h-[300px] h-[300px]">
        {/* Render header image with limited height or fallback */}
        {headerImage ? (
          <GatsbyImage
            image={headerImage}
            alt="Header Image"
            className="absolute inset-0 h-[300px] w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 z-0"></div>
        )}

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 w-full h-[300px]"
          style={{
            background: 'radial-gradient(circle, rgba(56, 60, 92, 0.7) 0%, rgba(0, 0, 0, 0.9) 70%)',
          }}
        ></div>

        {/* Headline centered - summary removed */}
        <div className="absolute top-0 h-full flex items-center justify-center text-center w-full">
          <div className="px-6 lg:px-20">
            <h1 className="text-3xl font-bold font-manrope text-white">
              {headline}
            </h1>
          </div>
        </div>
      </div>
      {/* Contact Form */}
      <div className="mx-auto px-6">
        <ContactForm />
      </div>
      {/* Body content */}
      <div className="text-center pb-6 space-y-4 font-manrope prose-md">
        <Markdown>{bodyText}</Markdown>
      </div>

    </Layout>
  );
}

// Query from Strapi - cycle based on slug
export const query = graphql`
  query ContactQuery {
    strapiContact {
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
      headline
      summary
    }
  }
`;