import React from "react"

const SimpleHeader = () => {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <img 
              src="https://energized-canvas-6b08f4eb08.media.strapiapp.com/anarky_Labs_Logo_White_794a742632.jpg"
              alt="Anarky Labs"
              className="h-[120px] w-[102px] sm:h-[200px] sm:w-[170px] object-contain"
            />
          </div>
          
          {/* Navigation - Right */}
          <nav className="flex space-x-4 sm:space-x-8 font-manrope">
            <a 
              href="https://airhud.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brandorange font-medium transition-colors text-sm sm:text-lg"
            >
              AirHUD
            </a>
            <a 
              href="https://airskill.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brandorange font-medium transition-colors text-sm sm:text-lg"
            >
              AirSkill
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader