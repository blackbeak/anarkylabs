import React, { useState } from "react"
import { Link } from "gatsby"

const SimpleHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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

          {/* Main Navigation - Center - Now shows on lg and up */}
          <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 font-manrope items-center">
            <Link 
              to="/airhud"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              AirHUD™
            </Link>
            <Link 
              to="/airskill"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              AirSkill
            </Link>
            <Link 
              to="/labs"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              Labs
            </Link>
            <Link 
              to="/faq"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              Support
            </Link>
            <Link 
              to="/blog"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              Resources
            </Link>
          </nav>

          {/* Secondary Navigation - Right - Now shows on lg and up */}
          <nav className="hidden lg:flex space-x-4 font-manrope items-center">
            <Link 
              to="/contact"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/shop-index"
              className="bg-white text-black text-sm hover:bg-brandorange hover:text-white font-medium transition-colors px-4 py-2 rounded-md"
            >
              Buy Now
            </Link>
          </nav>

          {/* Mobile Hamburger Button - Now shows below lg breakpoint */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            aria-label="Toggle menu"
          >
            <span 
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span 
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation Menu - Shows below lg breakpoint */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-128 pb-4' : 'max-h-0'
        }`}>
          <nav className="flex flex-col space-y-4 pt-4 font-manrope">
            {/* Navigation Links */}
            <Link 
              to="/airhud"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              AirHUD™
            </Link>
            <Link 
              to="/airskill"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              AirSkill
            </Link>
            <Link 
              to="/labs"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Labs
            </Link>
            <Link 
              to="/faq"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <Link 
              to="/blog"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/contact"
              className="text-white text-sm hover:text-brandorange font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {/* Buy Now Button - Bottom of mobile menu */}
            <Link 
              to="/shop-index"
              className="bg-white text-black text-sm hover:bg-brandorange hover:text-white font-medium transition-colors px-4 py-3 rounded-md text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Buy Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader