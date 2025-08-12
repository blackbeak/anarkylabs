import React from "react"

// heading for background headings (special graphics)
const SgHeadings = ({ title, description }) => {
  return (
    <header>
      <h1 className="pt-8 text-4xl md:text-6xl font-bold font-mandrope text-white">{title}</h1>
      {description && (
        <p className="mt-4 text-l font-mandrope text-white">{description}</p>
      )}
    </header>
  )
}

export default SgHeadings