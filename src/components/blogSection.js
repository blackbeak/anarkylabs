import React from "react"
import { Link } from "gatsby"
import { NewspaperIcon } from "../components/svg"

const BlogSection = ({ 
  articles = [], 
  sectionTitle = "Latest Articles",
  maxArticles = 6,
  className = ""
}) => {
  if (!articles || articles.length === 0) {
    return null
  }

  // Sort articles by ID in descending order (latest first) and limit
  const sortedArticles = articles
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, maxArticles)

  return (
    <section className={`bg-white py-16 sm:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="flex justify-center mb-4">
          <NewspaperIcon className="w-8 h-8 text-brandblue" />
        </p>
        {/* Section Title */}
        {sectionTitle && (
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-manrope font-bold text-gray-900">
              {sectionTitle}
            </h2>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sortedArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/article/${article.slug}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Article Image */}
              <div className="relative h-72 w-full flex-shrink-0">
                {article.seoFeatureImage?.localFile?.publicURL ? (
                  <img
                    src={article.seoFeatureImage.localFile.publicURL}
                    alt={article.seoTitle}
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
                <h3 className="text-xl font-bold font-manrope group-hover:text-brandorange transition-colors duration-300 mb-2">
                  {article.seoTitle}
                </h3>
                
                {article.seoSummary && (
                  <p className="text-gray-600 font-manrope text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {article.seoSummary}
                  </p>
                )}

                <span className="text-brandorange hover:underline hover:text-brandred font-manrope font-medium inline-block mt-auto">
                  Read More
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection