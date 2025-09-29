import React, { useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import ElfsightWidget from "../components/ElfsightWidget"; // Import the new widget

export const Head = ({ data }) => {
  const title = data.strapiBlog.title;
  const description = data.strapiBlog.headline;
  return <Seo title={title} description={description} />;
};

const BlogPage = ({ data }) => {
  const posts = data.allStrapiArticle.nodes;
  const categories = data.allStrapiCategory.nodes;

  // State to track the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filter posts based on the selected category (if categories field exists)
  const filteredPosts = selectedCategory && posts[0]?.categories
    ? posts.filter((post) => post.categories?.some((cat) => cat.slug === selectedCategory))
    : posts; // If no category is selected, show all posts

  // Sort posts by slug or title since id isn't available
  const sortedPosts = [...filteredPosts];

  // Extract header data from Strapi
  const blogHeader = data.strapiBlog;
  const headerImage = getImage(blogHeader.heroImage.localFile.childImageSharp.gatsbyImageData);
  const headline = blogHeader.headline;

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
          </div>
        </div>
      </div>

      {/* Blog Post and Category Layout */}
      <div className="container mx-auto px-6 pb-6 pt-6 space-y-4 font-manrope prose-md lg:flex lg:space-x-6">
        {/* Left Column for Blog Posts */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {sortedPosts.map((post) => (
              <a
                key={post.slug}
                href={`/article/${post.slug}`}
                className="group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-96 w-full flex-shrink-0">
                  <img
                    src={post.seoFeatureImage.localFile.publicURL}
                    alt={post.seoTitle}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="mt-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold group-hover:text-brandorange transition-colors duration-300">
                    {post.seoTitle}
                  </h3>
                  <p className="text-gray-600 mt-2 flex-grow">{post.seoSummary}</p>
                  <span className="text-brandorange hover:underline hover:text-brandred mt-4 inline-block">
                    Read More
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Column for Categories and Elfsight Widget */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          {/* Categories */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`text-brandorange hover:underline ${
                      selectedCategory === category.slug ? "font-bold text-brandred" : ""
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Elfsight Widget */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Company Feed</h3>
            <ElfsightWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
};

// GraphQL query for fetching blog posts and categories
export const query = graphql`
  query BlogPageQuery {
    allStrapiArticle {
      nodes {
        seoTitle
        seoSummary
        slug
        seoFeatureImage {
          localFile {
            publicURL
            childImageSharp {
              gatsbyImageData
            }
          }
          url
        }
      }
    }
    allStrapiCategory {
      nodes {
        id
        name
        slug
      }
    }
    strapiBlog {
      headline
      title
      heroImage {
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;

export default BlogPage;