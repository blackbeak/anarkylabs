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
      
      {/* Main Content with Background */}
      <main className="flex-1 flex items-center justify-center relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://energized-canvas-6b08f4eb08.media.strapiapp.com/background_3a091b37ad.jpg')`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-md mx-auto px-4 sm:px-6 lg:px-8 font-manrope">
          <h1 className="text-6xl font-bold text-white mb-4">404 – Signal lost</h1>
          <h2 className="text-2xl font-semibold text-white mb-6">
            This page is beyond visual line of sight (BVLOS).
          </h2>
          <p className="text-gray-200 mb-8 leading-relaxed">
            You're out of range. We're sorry, but the page you were looking for doesn't exist. Give us time! we're either building it or one of our tech people is re-routing it. In the meantime you can read about <Link to="/article/safe-situational-awareness-with-bvlos" className="underline hover:text-brandorange">BVLOS here</Link> or continue from our home page below
          </p>
          <Link 
            to="/"
            className="inline-block bg-white hover:bg-brandorange text-black hover:text-white px-6 py-3 rounded-lg font-manrope font-semibold transition-colors"
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