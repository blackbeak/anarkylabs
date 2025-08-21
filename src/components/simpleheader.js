import React from "react"
import { Link } from "gatsby"

const SimpleHeader = () => {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Left */}
          <div className="flex-shrink-0 pt-4 pb-4">
            <Link to="/">
              <img 
                src="https://energized-canvas-6b08f4eb08.media.strapiapp.com/Anarky_A_On_White_29b473bf95.png"
                alt="Anarky Labs"
                className="w-[200px] h-auto object-contain"
              />
            </Link>
          </div>
          
          {/* Navigation - Right */}
          <nav className="flex space-x-4 sm:space-x-8 font-manrope items-center">
            <Link 
              to="/about"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact"
              className="bg-white text-black text-sm hover:bg-brandorange hover:text-white font-medium transition-colors px-4 py-2 rounded-md"
            >
              Contact Sales
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader