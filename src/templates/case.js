import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import { Seo } from '../components/seo';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Markdown from '../components/markdown';

const CasePage = ({ data }) => {
  const { headline, heroImage, case_collections, testimonials } = data.strapiCase;
  const heroImageData = getImage(heroImage.localFile.childImageSharp.gatsbyImageData);

  return (
    <Layout>
      <Seo title={headline} />
      <div className="relative w-full">
        {heroImageData && (
          <GatsbyImage image={heroImageData} alt="Hero Image" className="w-full h-[400px] object-cover" />
        )}
        {/* Radial gradient overlay */}
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
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className={`grid grid-cols-1 ${testimonials.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg">
              <div className="flex items-start mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 mr-4">
                  {testimonial.avatar && (
                    <GatsbyImage
                      image={getImage(
                        testimonial.avatar.localFile.childImageSharp.gatsbyImageData
                      )}
                      alt={testimonial.name}
                      className="rounded-full"
                    />
                  )}
                </div>
                {/* Testimonial content */}
                <div className="flex-1">
                  <p className="font-manrope text-black">
                    {testimonial.testimonialText}
                  </p>
                  <p className="font-manrope text-sm font-bold text-black mt-4">
                    {testimonial.name}
                  </p>
                  <a
                    href={testimonial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-manrope text-brandblue hover:text-brandorange"
                  >
                    {testimonial.title}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        {case_collections && case_collections.map((collection, index) => {
          const caseImage = getImage(collection.caseImage?.localFile?.childImageSharp?.gatsbyImageData);
          const isEven = index % 2 === 0;
          const caseDescription = collection.shortDesc || ''; // Ensure it's a string
          return (
            <div key={index} className="flex flex-col lg:flex-row gap-6 mb-12">
              {isEven ? (
                <>
                  <div className="lg:w-1/3 w-full">
                    <GatsbyImage image={caseImage} alt="Case Image" className="rounded-lg" />
                  </div>
                  <div className="lg:w-2/3 w-full flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">{collection.headline}</h2>
                    <Markdown className="text-black font-manrope prose">{caseDescription}</Markdown>
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:w-2/3 w-full flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">{collection.headline}</h2>
                    <Markdown className="text-black font-manrope prose">{caseDescription}</Markdown>
                  </div>
                  <div className="lg:w-1/3 w-0">
                    <GatsbyImage image={caseImage} alt="Case Image" className="rounded-lg" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>


      <div className="w-full bg-sky-50">
        <div className="container mx-auto px-6 py-12 text-left h-[150px] flex items-center">
          <p className="text-xl font-manrope text-black">
            Get started by visiting our <Link to="/product/starter-kit-with-dji-controller-offer/" className="text-brandorange hover:underline hover:text-brandred">webshop</Link> or <Link to="/contact" className="text-brandorange hover:underline hover:text-brandred">get in touch here</Link> for more information.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CasePage;

export const query = graphql`
  query($slug: String!) {
    strapiCase(slug: { eq: $slug }) {
      headline
      heroImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      slug
      case_collections {
        headline
        shortDesc
        caseImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
      testimonials {
        title
        url
        testimonialText
        name
        avatar {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  }
`;