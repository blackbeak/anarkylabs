import React, { useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { Seo } from "../components/seo";
import Hero from "../components/hero";
import ElfsightWidget from "../components/ElfsightWidget";

export const Head = ({ data }) => {
  const title = data.strapiBlog.title;
  const description = data.strapiBlog.headline;
  return <Seo title={title} description={description} />;
};

const BlogPage = ({ data }) => {
  const posts = data.allStrapiArticle.nodes;
  const categories = data.allStrapiCategory.nodes;
  const allHeroes = data.allStrapiHero.nodes;

  // State for category filter and pagination
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter posts by category
  const filteredPosts = selectedCategory
    ? posts.filter((post) => 
        post.categories?.some((cat) => cat.slug === selectedCategory)
      )
    : posts;

  // Sort by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA; // Descending order (newest first)
  });


  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Handle category selection
  const handleCategoryClick = (categorySlug) => {
    setSelectedCategory(categorySlug === selectedCategory ? null : categorySlug);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('Selected category:', selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero heroID="blog-hero" allHeroes={allHeroes} />

      {/* Category Filter Buttons */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {/* All Articles button */}
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-4 py-2 rounded-md text-sm font-semibold font-manrope transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-brandblue text-white shadow-lg scale-105"
                  : "bg-white text-brandblue border-2 border-brandblue hover:bg-brandblue hover:text-white"
              }`}
            >
              All Articles
            </button>

            {/* Category buttons */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-4 py-2 rounded-md text-sm font-semibold font-manrope transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? "bg-brandblue text-white shadow-lg scale-105"
                    : "bg-white text-brandblue border-2 border-brandblue hover:bg-brandblue hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid - 3x3 layout */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {currentPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/article/${post.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  {/* Article Image */}
                  <div className="relative h-64 w-full flex-shrink-0">
                    {post.seoFeatureImage?.localFile?.publicURL ? (
                      <img
                        src={post.seoFeatureImage.localFile.publicURL}
                        alt={post.seoTitle}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold font-manrope group-hover:text-brandorange transition-colors duration-300 mb-3">
                      {post.seoTitle}
                    </h3>
                    
                    {post.seoSummary && (
                      <p className="text-gray-600 font-manrope text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                        {post.seoSummary}
                      </p>
                    )}

                    <span className="text-brandorange font-semibold hover:text-brandred transition-colors duration-300 inline-block mt-auto">
                      Read More →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 font-manrope">
                No articles found in this category.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold font-manrope transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-brandblue border-2 border-brandblue hover:bg-brandblue hover:text-white"
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg font-semibold font-manrope transition-all duration-300 ${
                      currentPage === pageNumber
                        ? "bg-brandblue text-white shadow-lg"
                        : "bg-white text-brandblue border-2 border-brandblue hover:bg-brandblue hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold font-manrope transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-brandblue border-2 border-brandblue hover:bg-brandblue hover:text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Elfsight Widget Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <ElfsightWidget />
        </div>
      </div>
    </Layout>
  );
};

// GraphQL query for fetching blog posts, categories, and heroes
export const query = graphql`
  query BlogPageQuery {
    allStrapiArticle {
      nodes {
        seoTitle
        seoSummary
        slug
        date
        categories {
          name
          slug
        }
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
    allStrapiHero {
      nodes {
        heroID
        headline
        description
        ctaOneText
        ctaOneLink
        ctaTwoText
        ctaTwoLink
        backgroundVideo
        textAlignment
        overlayEnabled
        overlayOpacity
        backgroundMedia {
          mime
          url
          localFile {
            publicURL
            childImageSharp {
              gatsbyImageData(
                layout: FULL_WIDTH
                placeholder: BLURRED
                formats: [AUTO, WEBP]
              )
            }
          }
        }
      }
    }
    strapiBlog {
      headline
      title
    }
  }
`;

export default BlogPage;