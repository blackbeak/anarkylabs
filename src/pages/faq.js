import React from "react";
import Markdown from "../components/markdown";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import FaqItems from '../components/faqitems';

// Add Page Head component and pass in SEO variables from GraphQL
export const Head = ({ data }) => {
  const title = data.strapiFaqHome.title;
  const description = data.strapiFaqHome.headline;
  return <Seo title={title} description={description} />;
};

export default function FaQPage({ data }) {
  const faq = data.strapiFaqHome;
  const faqItems = data.allStrapiFaq.nodes;

  // Gracefully handle the image - check if the image, localFile, and childImageSharp exist
  const background = getImage(faq.background.localFile.childImageSharp.gatsbyImageData);
  const headline = faq.headline;
  const bodyText = faq.shortDesc.data.shortDesc;

  return (
    <Layout>
      {/* Header section */}
      <div className="relative w-full min-h-[500px] h-[500px]">
        {background ? (
          <GatsbyImage
            image={background}
            alt="Header Image"
            className="absolute inset-0 h-[500px] w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 z-0"></div>
        )}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle, rgba(56, 60, 92, 0.7) 0%, rgba(0, 0, 0, 0.9) 70%)',
          }}
        ></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold font-manrope text-white">
              {headline}
            </h1>
            <div className="prose text-white font-manrope">
              <Markdown>{bodyText}</Markdown>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="container mx-auto my-8">
        <div className="gap-6">
          <FaqItems faqItems={faqItems} />
        </div>
      </section>
    </Layout>
  );
}

// Query from Strapi to get FAQ items
export const query = graphql`
  query faqQuery {
    strapiFaqHome {
      headline
      title
      background {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      shortDesc {
        data {
          shortDesc
        }
      }
    }
    allStrapiFaq {
      nodes {
        id
        question
        answer
      }
    }
  }
`;