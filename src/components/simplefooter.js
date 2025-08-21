import React from "react"
import { Link } from "gatsby"
import { FaLinkedin, FaYoutube, FaEnvelope } from "react-icons/fa"

const SimpleFooter = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center">
          {/* Copyright - Left */}
          <div className="text-white font-manrope">
            <p>&copy; 2025 Anarky Labs Oy. All rights reserved.</p>
          </div>
          
          {/* Internal Links - Center */}
          <div className="flex space-x-6 font-manrope">
            <Link 
              to="/about"
              className="text-white hover:text-brandorange font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact"
              className="text-white hover:text-brandorange font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
          
          {/* Social Icons - Right */}
          <div className="flex space-x-4">
            
            <a href="https://www.linkedin.com/company/70244980/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaLinkedin size={20} className="text-white" />
            </a>
            <a
              href="https://www.youtube.com/@airhud"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaYoutube size={20} className="text-white" />
            </a>
            
              <a href="mailto:info@anarkylabs.com"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaEnvelope size={20} className="text-white" />
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center space-y-4">
          
          {/* Internal Links - Row 1 */}
          <div className="flex space-x-6 font-manrope">
            <Link 
              to="/about"
              className="text-white hover:text-brandorange font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact"
              className="text-white hover:text-brandorange font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
          
          {/* Social Icons - Row 2 */}
          <div className="flex space-x-4">
            
            <a href="https://www.linkedin.com/company/70244980/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaLinkedin size={20} className="text-white" />
            </a>
            
             <a href="https://www.youtube.com/@airhud"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaYoutube size={20} className="text-white" />
            </a>
            
            <a href="mailto:info@anarkylabs.com"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaEnvelope size={20} className="text-white" />
            </a>
          </div>

          {/* Copyright - Row 3 */}
          <div className="text-white font-manrope text-center">
            <p>&copy; 2025 Anarky Labs Oy. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default SimpleFooter