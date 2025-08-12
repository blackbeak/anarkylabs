import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import { Seo } from '../components/seo';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Markdown from '../components/markdown';
import ScenarioCarousel from "../components/ScenarioCarousel";
import ProductVariables from "../components/productVariables";

const FeaturesPage = ({ data }) => {
  const headline = data.strapiFeatures.headline;
  const scenarios = data.strapiFeatures.scenarios;
  const techHeadline = data.strapiFeatures.technicalHeadline;
  const techCollections = data.strapiFeatures.tech_collections;
  const kitImage = getImage(data.strapiFeatures.training_kit.kitImage.localFile.childImageSharp.gatsbyImageData);
  const trainingKitHeadline = data.strapiFeatures.training_kit.headline;
  const productVariables = data.strapiFeatures.training_kit.product_variables;

  return (
    <Layout>
      <Seo title="Features" />
      <div className="w-full bg-black">
        <div className="container mx-auto px-6 py-12 text-left">
          <h1 className="text-2xl font-manrope font-bold text-white">
            {headline}
          </h1>
        </div>
      </div>
      <div className="w-full bg-white">
        <div className="container mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold font-manrope text-black">
            {techHeadline}
          </h2>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        {techCollections && techCollections.map((tech, index) => {
          const techImage = getImage(tech.techImage.localFile.childImageSharp.gatsbyImageData);
          const isEven = index % 2 === 0;
          const techDescription = tech.techDescription || ''; // Ensure it's a string
          return (
            <div key={index} className="flex flex-col lg:flex-row gap-6 mb-12">
              {isEven ? (
                <>
                  <div className="lg:w-1/3 w-full">
                    <GatsbyImage image={techImage} alt="A picture is here" 
                    className="rounded-lg cover"
                    />
                  </div>
                  <div className="lg:w-2/3 w-full flex flex-col justify-center">
                    <Markdown className="text-black font-manrope prose">{techDescription}</Markdown>

                  </div>
                </>
              ) : (
                <>
                  <div className="lg:w-2/3 w-full flex flex-col justify-center">
                    <Markdown className="text-black font-manrope prose">{techDescription}</Markdown>
                  </div>
                  <div className="lg:w-1/3 w-0">
                    <GatsbyImage image={techImage} alt="A picture is here" className="rounded-lg" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
     
     
      <div className="mx-auto px-6 py-12 bg-black">
        <ScenarioCarousel scenarios={scenarios} />
      </div>
      
      <ProductVariables
        kitImage={kitImage}
        trainingKitHeadline={trainingKitHeadline}
        productVariables={productVariables}
      />

      <div className="w-full bg-sky-50">
        <div className="container mx-auto px-6 py-12 text-left flex items-center">
          <p className="text-xl font-manrope text-black">
            Do you need custom scenarios or controllers? <Link to="/contact" className="text-brandorange hover:underline hover:text-brandred">Let us know!</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FeaturesPage;

export const query = graphql`
  query {
    strapiFeatures {
      headline
      scenarioHeadline
      scenarioText
      technicalHeadline
      scenarios {
        name
        shortDesc
        scenarioImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
      tech_collections {
        techDescription
        techImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
      training_kit {
        headline
        kitImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        product_variables {
          description
          name
        }
      }
    }
  }
`;