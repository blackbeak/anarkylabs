import React from "react"
import Footer from "./simplefooter"
import Navbar from "./simpleheader"


const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-white text-neutral-900">
      <div>

        <Navbar />
       
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
