import React from "react";
import Markdown from "../components/markdown";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import { FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa"; // Import FontAwesome icons

// Utility function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))((\w|-){11})(?:\S+)?/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
};

// Add Page Head component and pass in SEO variables from GraphQL
export const Head = ({ data }) => {
  const title = data.strapiArticle.title;
  const description = data.strapiArticle.summary;
  const shareImage = data.strapiArticle.articleImage.url;
  //console.log("shareImage URL:", shareImage);

  return <Seo title={title} description={description} shareImage={shareImage} />;
};

export default function articlePage({ data }) {
  const article = data.strapiArticle;

  // Header Image
  const headerImage = getImage(article.headerImage.localFile.childImageSharp.gatsbyImageData);

  // Video or article image
  const articleImage = getImage(article.articleImage.localFile.childImageSharp.gatsbyImageData);
  const videoUrl = article.videoUrl ? getYouTubeEmbedUrl(article.videoUrl) : null;

  // Body Texts
  const bodyImageText = article.bodyImageText?.data?.bodyImageText || "";
  const headline = article.headline;
  const summary = article.summary;
  const bodyText = article.body.data.body;

  // Author information
  const author = article.author;
  const authorHeadshot = author.headshot ? getImage(author.headshot.localFile.childImageSharp.gatsbyImageData) : null;

  // tests
  // console.log("article.headerImage:", article.headerImage);
  return (
    <Layout>
      {/* Header section */}
      <div className="relative w-full min-h-[500px] h-[500px]">
        {headerImage ? (
          <GatsbyImage
            image={headerImage}
            alt="Header Image"
            className="absolute inset-0 h-[500px] w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 h-[500px] w-full bg-gray-200"></div>
        )}

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "radial-gradient(circle, rgba(56, 60, 92, 0.7) 0%, rgba(0, 0, 0, 0.9) 70%)",
          }}
        ></div>

        {/* Headline inside a container aligned to the left */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold font-manrope text-white">
              {headline}
            </h1>
            {/* Display the summary below the headline */}
            <p className="text-lg font-manrope text-white mt-2">
              {summary}
            </p>
          </div>
        </div>
      </div>

    {/* Video or Article Image Section with bodyImageText */}
      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-6">
        {/* Image or Video Section */}
        <div className="lg:w-1/3 w-full flex-shrink-0">
          {videoUrl ? (
            <div className="w-full h-[400px]">
              <iframe
                src={videoUrl}
                title="Embedded video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          ) : articleImage ? (
            <GatsbyImage 
              image={articleImage} 
              alt="Article Image" 
              className="w-full lg:max-w-[500px] h-auto rounded-lg" 
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-300"></div>
          )}
        </div>

        {/* Text Section */}
        <div className="flex-1 prose font-manrope text-xl lg:max-w-2xl">
          {bodyImageText && <Markdown>{bodyImageText}</Markdown>}
        </div>
      </div>

      {/* Body content */}
      <div className="container mx-auto px-6 pb-6 pt-6 space-y-4 font-manrope prose-md">
      <Markdown>{bodyText}</Markdown>
      </div>

     {/* Author Section */}
        <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-6 items-start bg-orange-50 rounded-lg shadow-lg">
        {/* Left-hand side: Author's Headshot */}
        {authorHeadshot && (
            <div className="w-24 h-24 lg:w-32 lg:h-32"> {/* Adjusted size for smaller avatar */}
            <GatsbyImage image={authorHeadshot} alt={author.name} className="rounded-full object-cover" />
            </div>
        )}

        {/* Right-hand side: Author's Info */}
        <div className="flex-1">
            <h3 className="text-2xl font-bold font-manrope">{author.name}</h3>
            <p className="text-lg font-manrope text-gray-600">{author.title}</p>
            <p className="mt-4 text-gray-800 font-manrope">{author.bio}</p>

            {/* Icons for contact information */}
            <div className="flex space-x-4 mt-4">
            {author.email && (
                <a href={`mailto:${author.email}`} className="text-gray-700 hover:text-brandred">
                <FaEnvelope size={24} />
                </a>
            )}
            {author.telephone && (
                <a href={`tel:${author.telephone}`} className="text-gray-700 hover:text-brandred">
                <FaPhone size={24} />
                </a>
            )}
            {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-brandred">
                <FaLinkedin size={24} />
                </a>
            )}
            </div>
        </div>
        </div>
    </Layout>
  );
}

// Query from Strapi - cycle based on slug
export const query = graphql`
  query ($slug: String) {
    strapiArticle(slug: { eq: $slug }) {
      articleImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
        url
      }
      author {
        bio
        email
        name
        title
        telephone
        linkedin
        headshot {
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
      body {
        data {
          body
        }
      }
      bodyImageText {
        data {
          bodyImageText
        }
      }
      headerImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      headline
      slug
      summary
      title
      videoUrl
    }
  }
`;