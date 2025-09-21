import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { FaLinkedin, FaYoutube, FaEnvelope } from "react-icons/fa"
import ApiForm from "./apiform"

const SimpleFooter = () => {
  const data = useStaticQuery(graphql`
    query {
      strapiFooter {
        logo {
          localFile {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
              )
            }
          }
        }
        summary
        email
        phone
        address
        headerOne
        headerTwo
        headerThree
        headerFour
        subscribeHeader
        subscribeSummary
        copyrightLeft
        copyrightRight
      }
    }
  `)

  const footer = data.strapiFooter
  const logo = getImage(footer?.logo?.localFile?.childImageSharp?.gatsbyImageData)

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-center md:text-left">
          
          {/* Company Section - Left side with logo, summary, contact info */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            {logo && (
              <div className="mb-4 flex justify-center md:justify-start">
                <GatsbyImage
                  image={logo}
                  alt="Anarky Labs Logo"
                  className="w-48 max-h-16 object-contain"
                />
              </div>
            )}
            
            {/* Company Name (fallback if no logo) */}
            {!logo && (
              <h3 className="text-xl font-bold font-manrope mb-4">ANARKY LABS</h3>
            )}

            {/* Summary */}
            {footer?.summary && (
              <p className="text-gray-300 font-manrope text-sm mb-6 leading-relaxed">
                {footer.summary}
              </p>
            )}

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              {footer?.email && (
                <div className="flex items-center text-gray-300 font-manrope text-sm justify-center md:justify-start">
                  <FaEnvelope size={14} className="mr-3 text-gray-400" />
                  <a href={`mailto:${footer.email}`} className="hover:text-brandorange transition-colors">
                    {footer.email}
                  </a>
                </div>
              )}
              
              {footer?.phone && (
                <div className="flex items-center text-gray-300 font-manrope text-sm justify-center md:justify-start">
                  <svg className="w-3.5 h-3.5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href={`tel:${footer.phone}`} className="hover:text-brandorange transition-colors">
                    {footer.phone}
                  </a>
                </div>
              )}
              
              {footer?.address && (
                <div className="flex items-start text-gray-300 font-manrope text-sm justify-center md:justify-start">
                  <svg className="w-3.5 h-3.5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{footer.address}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3 justify-center md:justify-start">
              <a 
                href="https://www.linkedin.com/company/70244980/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <FaLinkedin size={16} className="text-white" />
              </a>
              <a
                href="https://www.youtube.com/@airhud"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-700 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <FaYoutube size={16} className="text-white" />
              </a>
              <a 
                href="mailto:info@anarkylabs.com"
                className="w-8 h-8 bg-gray-700 hover:bg-brandorange rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <FaEnvelope size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Cases Section */}
          <div className="col-span-1 md:col-start-3">
            <h3 className="text-lg font-semibold font-manrope mb-4">
              {footer?.headerOne || "Cases"}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/case/law-enforcement/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Law Enforcement</Link></li>
              <li><Link to="/case/drone-pilot-academies/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Drone training academies</Link></li>
              <li><Link to="/case/fire-departments/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Fire departments</Link></li>
            </ul>
          </div>

          {/* Products Section */}
          <div className="col-span-1 md:col-start-4">
            <h3 className="text-lg font-semibold font-manrope mb-4">
              {footer?.headerTwo || "Products"}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/airhud" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">AirHUD</Link></li>
              <li><Link to="/airskill" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">AirSkill</Link></li>
              <li><Link to="/labs" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Labs</Link></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-span-1 md:col-start-5">
            <h3 className="text-lg font-semibold font-manrope mb-4">
              {footer?.headerThree || "Resources"}
            </h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">White papers</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Blog/News</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Support/FAQ</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="col-span-1 md:col-start-6">
            <h3 className="text-lg font-semibold font-manrope mb-4">
              {footer?.headerFour || "Company"}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Contact</Link></li>
              <li><Link to="/legal/terms/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Terms & Conditions</Link></li>
              <li><Link to="/legal/license/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">License Agreement</Link></li>
              <li><Link to="/legal/privacy/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Privacy Policy</Link></li>
              <li><Link to="/legal/cookies/" className="text-gray-300 hover:text-brandorange transition-colors font-manrope">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Stay Updated Section */}
          <div className="bg-gray-900 p-4 rounded-lg col-span-2 md:col-span-6">
            <h3 className="text-lg font-semibold font-manrope mb-4 text-center md:text-left">
              {footer?.subscribeHeader || "Stay Updated"}
            </h3>
            
            {/* Flex container for text and email form */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <p className="text-gray-300 font-manrope text-sm flex-1 text-center md:text-left">
                {footer?.subscribeSummary || "Subscribe to our newsletter for the latest updates"}
              </p>
              
              <div className="flex-shrink-0 justify-center md:justify-end">
                <ApiForm 
                  formId="subscribeForm"
                   layout="horizontal"
                  className=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            
            {/* Copyright */}
            <div className="text-gray-400 font-manrope text-sm">
              {footer?.copyrightLeft || "© 2025 Anarky Labs Oy. All rights reserved."}
            </div>

            {/* Copyright right */}
            <div className="text-gray-400 font-manrope text-sm">
              {footer?.copyrightRight}
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default SimpleFooter