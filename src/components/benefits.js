import React from "react"
import {
  FaPiggyBank,
  FaMedal,
  FaCalendarCheck,
  FaCloudSunRain,
  FaRocket,
  FaShieldAlt,
  FaEye,
  FaCog,
  FaUsers,
  FaBolt
} from "react-icons/fa"

const Benefits = ({ 
  benefitHeadline,
  benefitText,
  selectedBenefits = [], 
  className = "",
  backgroundColor = "bg-white"
}) => {
  if (!selectedBenefits || selectedBenefits.length === 0) {
    return null
  }

  // Sort benefits by orderBy field to ensure consistent icon mapping
  const sortedBenefits = [...selectedBenefits].sort((a, b) => (a.orderBy || 0) - (b.orderBy || 0))

  // Define an array of icons - can be expanded as needed
  const benefitIcons = [
    <FaMedal />,        // orderBy: 1
    <FaPiggyBank />,    // orderBy: 2
    <FaCloudSunRain />, // orderBy: 3
    <FaRocket />,       // orderBy: 4
    <FaCalendarCheck />,// orderBy: 5
    <FaShieldAlt />,    // orderBy: 6
    <FaEye />,          // orderBy: 7
    <FaCog />,          // orderBy: 8
    <FaUsers />,        // orderBy: 9
    <FaBolt />          // orderBy: 10
  ]

  return (
    <div className={`${backgroundColor} ${className}`}>
      {/* Benefit Headline and Text */}
      {(benefitHeadline || benefitText) && (
        <div className="container mx-auto px-6 lg:px-12 py-8">
          {benefitHeadline && (
            <h2 className="text-3xl font-bold font-manrope text-center">
              {benefitHeadline}
            </h2>
          )}
          {benefitText && (
            <h2 className="text-xl font-manrope text-center mt-2">
              {benefitText}
            </h2>
          )}
        </div>
      )}

      {/* Benefits Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sortedBenefits.map((benefit) => {
            // Use the actual orderBy value to pick the icon (subtract 1 for zero-based array)
            const iconIndex = (benefit.orderBy || 1) - 1
            const icon = benefitIcons[iconIndex] || <FaRocket /> // Default icon if orderBy exceeds array bounds

            return (
              <div key={benefit.id} className="flex items-start space-x-4">
                {/* Blue Icon */}
                <div className="text-brandblue text-2xl">{icon}</div>

                {/* Benefit title and body */}
                <div>
                  <h3 className="text-xl font-bold font-manrope">
                    {benefit.benefitTitle}
                  </h3>
                  <p className="font-manrope">{benefit.benefitBody}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Benefits