import * as React from "react"
import { Link } from "gatsby"
import SimpleHeader from "../components/simpleheader"
import SimpleFooter from "../components/simplefooter"
import { Seo } from "../components/seo"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SimpleHeader />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Page not ready yet, missing in action or not found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We're sorry, but the page you were looking for doesn't exist. Give us time!
          </p>
          <Link 
            to="/"
            className="inline-block bg-black hover:bg-brandorange text-white px-6 py-3 rounded-lg font-manrope font-semibold transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <SimpleFooter />
    </div>
  )
}

// Add Page Head component and pass in SEO variables from GraphQL
export const Head = () => {
  const title = "Page not ready yet, missing in action or not found";
  const description = "We're sorry, but the page you were looking for doesn't exist. Give us time!";
  return <Seo title={title} description={description} />;
};

export default NotFoundPage