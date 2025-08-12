import React from "react"
import { FaLinkedin, FaYoutube, FaEnvelope } from "react-icons/fa"

const SimpleFooter = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Copyright - Left */}
          <div className="text-white font-manrope">
            <p>&copy; 2025 Anarky Labs Oy. All rights reserved.</p>
          </div>
          
          {/* Social Icons - Right */}
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/company/70244980/admin/dashboard/"
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
            <a
              href="mailto:info@anarkylabs.com"
              className="w-10 h-10 bg-gray-600 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <FaEnvelope size={20} className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SimpleFooter