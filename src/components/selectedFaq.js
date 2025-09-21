import React from "react"
import FaqItems from "./faqitems"

const SelectedFAQ = ({ 
  selectedFAQs = [], 
  className = "",
  sectionTitle = "Frequently Asked Questions",
  showTitle = true,
  backgroundColor = "bg-gray-50"
}) => {
  if (!selectedFAQs || selectedFAQs.length === 0) {
    return null
  }

  return (
    <section className={`${backgroundColor} py-16 sm:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Title */}
          {showTitle && sectionTitle && (
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold text-gray-900">
                {sectionTitle}
              </h2>
            </div>
          )}

          {/* FAQ Items */}
          <div className="flex justify-center">
            <FaqItems faqItems={selectedFAQs} />
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default SelectedFAQ