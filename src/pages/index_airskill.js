import * as React from "react";
import { useState } from "react"; // Use state for video facade toggle
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Markdown from "../components/markdown";
import {
  FaPiggyBank,
  FaMedal,
  FaCalendarCheck,
  FaCloudSunRain,
  FaRocket,
} from "react-icons/fa";
import { getVimeoEmbedUrl } from '../components/utils'; // Import Vimeo utility function
import ScenarioCarousel from "../components/ScenarioCarousel";
import ProductVariables from "../components/productVariables"; // Import the ProductVariables component


const IndexPage = ({ data }) => {
  const idx = data.strapiIndex;
  const headline = idx.headline;
  const summary = idx.summary;
  const benefitHeadline = idx.benefitHeadline;
  const headerImage = getImage(
    idx.headerImage.localFile.childImageSharp.gatsbyImageData
  );
  const bodyImage = getImage(
    idx.bodyImage.localFile.childImageSharp.gatsbyImageData
  );
  const downloadImage = getImage(idx.downloadImage.localFile.childImageSharp.gatsbyImageData);
  const downloadBenefits = idx.downloadBenefits?.data?.downloadBenefits;
  const videoUrl = idx.videoUrl ? getVimeoEmbedUrl(idx.videoUrl) : null; // Use Vimeo utility function
  const bodyImageText = idx.bodyImageText?.data?.bodyImageText;
  const body = idx.body.data.body;
  const benefits = data.allStrapiBenefit.nodes;
  const useCases = data.allStrapiTarget.nodes;
  const testimonials = data.allStrapiTestimonial.nodes;
  //const logos = data.allStrapiReferenceLogo.nodes;

  const [showVideo, setShowVideo] = useState(false); // State to toggle between facade and video
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab

  // Load Pipedrive Webform Script
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://webforms.pipedrive.com/f/loader";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const trainingKit = data.strapiTrainingKit;
  const kitImage = getImage(trainingKit.kitImage.localFile.childImageSharp.gatsbyImageData);
  const productVariables = trainingKit.product_variables;
  const trainingKitHeadline = trainingKit.headline;
  const scenarios = data.allStrapiScenario.nodes;

  // Define an array of icons corresponding to the order of the benefits
  const benefitIcons = [
    <FaMedal />,
    <FaPiggyBank />,
    <FaCloudSunRain />,
    <FaRocket />,
    <FaCalendarCheck />,
  ];

  return (
    <Layout>
      <div className="relative w-full">
        {/* Background Image */}
        {headerImage && (
          <GatsbyImage
            image={headerImage}
            alt="Header Image"
            className="w-full h-[500px] object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle, rgba(46, 50, 82, 0.8) 0%, rgba(0, 0, 0, 1) 70%)',
          }}
        ></div>

        {/* Headline */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl lg:text-5xl font-bold font-manrope text-white">
            {headline}
          </h1>
          <p className="text-lg font-manrope text-white mt-2">{summary}</p>

          {/* Button row */}
          <div className="mt-4 flex space-x-4">
            <Link
              to="/shop-index"
              className="inline-block px-6 py-3 text-black bg-white rounded-md font-bold hover:bg-brandorange hover:text-white transition duration-300"
            >
              Buy Now
            </Link>

            <Link
              to="/trial"
              className="inline-block px-6 py-3 text-white border border-white rounded-md font-bold hover:bg-brandorange hover:text-white transition duration-300"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Benefits section */}
      <div className="container mx-auto px-6 lg:px-12 py-8">
        <h2 className="text-3xl font-bold font-manrope text-center">
          {benefitHeadline}
        </h2>
        <h2 className="text-xl font-manrope text-center">{body}</h2>
      </div>
      {/* Benefits section */}
      <div className="container m-auto px-6 py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            // Get the corresponding icon for this benefit based on its order
            const icon = benefitIcons[index] || <FaRocket />; // Default icon if index exceeds array bounds

            return (
              <div key={benefit.id} className="flex items-start space-x-4">
                {/* Blue Icon */}
                <div className="text-brandblue text-2xl">{icon}</div>

                {/* Benefit title and body */}
                <div>
                  <h3 className="text-xl font-bold font-manrope">
                    {benefit.benefitTitle}
                  </h3>
                  <p className="font-manrope">{benefit.benefitBody}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
     {/* Video and BodyImageText Section */}
        <div className="container m-auto px-6 py-12 bg-white">
          {/* Video Section */}
          <div className="w-full mb-6">
            {videoUrl && !showVideo ? (
              <div className="relative w-full h-[600px] rounded-lg cursor-pointer">
                {/* Facade image */}
                {bodyImage && (
                  <GatsbyImage
                    image={bodyImage}
                    alt="Body Image Facade"
                    className="w-full h-full rounded-lg"
                  />
                )}
                {/* Play Button Overlay */}
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg transition-opacity hover:opacity-80"
                >
                  <div className="bg-black text-white hover:text-brandorange rounded-lg p-3 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-brandorange"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7 6v12l10-6z" />
                    </svg>
                    <p className="text-white text-lg hover:text-brandorange font-manrope p-2"> See how it works</p>
                  </div>
                </button>
              </div>
            ) : videoUrl ? (
              <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={videoUrl}
              title="Embedded video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              style={{ borderRadius: "15px" }}
            ></iframe>
            </div>
            ) : (
              bodyImage && (
                <GatsbyImage
                  image={bodyImage}
                  alt="Body Image"
                  className="w-full h-auto rounded-lg"
                />
              )
            )}
          </div>
          
        {/* BodyText Section */}
        <div className="container m-auto px-6 py-12 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="prose prose-lg text-2xl font-manrope">
              <Markdown>{bodyImageText}</Markdown>
            </div>
          </div>
        </div>
        </div>
    
      {/* Product Variables Section - 4 drop downs */}
      <ProductVariables
        kitImage={kitImage}
        trainingKitHeadline={trainingKitHeadline}
        productVariables={productVariables}
      />
    {/* White Paper Lead Gen Section */}
    <div className="w-full bg-white font-manrope py-16">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left: Image */}
        <div className="lg:w-1/2 w-full">
          {downloadImage && (
            <GatsbyImage
              image={downloadImage}
              alt="White Paper VR Drone Training"
              className="rounded-lg shadow-xl w-full max-w-md mx-auto"
            />
          )}
        </div>

        {/* Right: Markdown content + Form */}
        <div className="lg:w-1/2 w-full text-left">
          {downloadBenefits && (
            <div className="prose lg:prose-l max-w-xl mb-6 lg:pl-10">
              <Markdown>{downloadBenefits}</Markdown>
            </div>
          )}

          <div
            className="pipedriveWebForms max-w-xl"
            style={{ marginLeft: "0" }}
            data-pd-webforms="https://webforms.pipedrive.com/f/c58xAxjJS7pFreU60C47BECv1vwyjL7ew5PIIQwGp5MhQRHsSC6D8x4ypLPJPv3dkL"
          ></div>
        </div>
      </div>
    </div>

    
     
      {/* Testimonials Section */}
      <div className="w-full bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-manrope text-center mb-8 text-black">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    {/* Use Cases Section */}
    <div className="w-full bg-black py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-bold font-manrope text-center text-white mb-8">
          Use Cases
        </h2>
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center pl-2">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                className={`text-md lg:text-lg font-manrope py-2 px-4 ${activeTab === index ? 'text-brandorange' : 'text-white'} hover:text-brandorange transition duration-300 cursor-pointer`}
                onClick={() => setActiveTab(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(index);
                  }
                }}
              >
                {useCase.targetTitle}
              </div>
            ))}
          </div>
          <div className="w-full bg-black rounded-lg p-6 lg:mr-12 flex justify-center">
            <div className="flex flex-col lg:flex-row gap-6 items-center max-w-4xl">
              <div className="lg:w-1/3 w-full">
                <GatsbyImage
                  image={getImage(useCases[activeTab].targetImage.localFile.childImageSharp.gatsbyImageData)}
                  alt={useCases[activeTab].targetTitle}
                  className="rounded-lg"
                />
              </div>
              <div className="lg:w-2/3 w-full">
                <Markdown className="text-2xl text-white">
                  {useCases[activeTab].targetBody}
                </Markdown>
                <div className="mt-4">
                  <Link
                    to={`/case/${useCases[activeTab].slug}`}
                    className="inline-block px-6 py-3 text-white bg-brandblue border border-brandblue rounded-md font-bold hover:bg-brandorange hover:border-brandorange hover:text-white transition duration-300"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Scenario Carousel Section */}
    <div className="w-full py-12 bg-black">
      <div className="container mx-auto px-6 lg:px-12">
        <ScenarioCarousel scenarios={scenarios} />
      </div>
    </div>

    </Layout>
  );
};

export const Head = ({ data }) => {
  const idx = data.strapiIndex;
  const title = idx.title;
  const image = idx.bodyImage.url;
  return <Seo title={title} shareImage={image} />;
};

// get the data with GraphQL
export const query = graphql`
  query indexQuery {
    strapiIndex {
      body {
        data {
          body
        }
      }
      bodyImage {
        url
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      bodyImageText {
        data {
          bodyImageText
        }
      }
      downloadImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      downloadBenefits {
        data {
          downloadBenefits
        }
      }
      pdfDownload{
        localFile {
          publicURL
        }
      }
      title
      videoUrl
      headline
      summary
      benefitHeadline
      headerImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
    allStrapiBenefit(sort: { orderBy: ASC }) {
      nodes {
        id
        benefitTitle
        benefitBody
        orderBy
      }
    }
    allStrapiTarget {
      nodes {
        targetTitle
        targetBody
        slug
        targetImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
    allStrapiTestimonial {
      nodes {
        title
        testimonialText
        name
        avatar {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        url
      }
    }
    allStrapiReferenceLogo {
      nodes {
        logo {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        url
      }
    }
    strapiTrainingKit {
        kitImage {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        headline
        product_variables {
          name
          description
        }
      }
    allStrapiScenario {
      nodes {
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
    }
  }
`;

export default IndexPage;