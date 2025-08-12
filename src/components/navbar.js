import React, { useState } from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false); // Controls mobile menu visibility
  const [dropdown, setDropdown] = useState(false); // Controls "Use Cases" dropdown visibility

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    <nav className="w-full bg-black shadow-2xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-8 mx-auto lg:max-w-full">
        {/* Logo */}
        <Link to="/" className="py-4">
          <StaticImage
            src="../images/whiteA.png"
            className="w-16"
            alt="From Anarky Labs with love"
          />
        </Link>

        {/* Hamburger Menu (Small Screens) */}
        <div className="md:hidden">
          <button
            className="p-2 text-white rounded-md focus:outline-none"
            onClick={() => setNavbar(!navbar)}
          >
            {navbar ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Items */}
        <div
          className={`${
            navbar ? "block" : "hidden"
          } md:flex flex-col md:flex-row items-center text-white font-manrope space-y-6 md:space-y-0 md:space-x-8 w-full md:w-auto`}
        >
          {/* Menu List */}
          <ul
            className={`flex flex-col md:flex-row md:items-center ${
              navbar ? "items-end pr-4" : "md:justify-end"
            } space-y-6 md:space-y-0 md:space-x-8`}
          >
            {/* Use Cases */}
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-brandorange flex items-center"
              >
                Use Cases
                <span className="ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
              {/* Dropdown Menu */}
              <div
                className={`${
                  dropdown ? "block" : "hidden"
                } absolute mt-2 py-2 w-48 bg-white rounded-lg shadow-md z-50 ${
                  navbar
                    ? "top-0 right-full" // Small screens: dropdown aligns left
                    : "top-full left-0" // Large screens: dropdown aligns below
                }`}
              >
                <Link
                  to="/case/law-enforcement"
                  className="block px-4 py-2 text-gray-800 hover:bg-orange-100"
                >
                  Law Enforcement
                </Link>
                <Link
                  to="/case/fire-departments"
                  className="block px-4 py-2 text-gray-800 hover:bg-orange-100"
                >
                  Fire Departments
                </Link>
                <Link
                  to="/case/drone-pilot-academies"
                  className="block px-4 py-2 text-gray-800 hover:bg-orange-100"
                >
                  Drone Training Academies
                </Link>
              </div>
            </li>

            {/* Features */}
            <li>
              <Link to="/features" className="hover:text-brandorange">
                Features
              </Link>
            </li>

            {/* contact */}
            <li>
              <Link to="/contact" className="hover:text-brandorange">
                Book a demo
              </Link>
            </li>

            {/* Shop Now */}
            <li>
              <Link
                to="/shop-index"
                className="px-4 py-3 bg-white text-black rounded-md hover:bg-brandorange transition font-bold text-center"
              >
                Buy Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}