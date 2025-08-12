import React from "react"

const SimpleHeader = () => {
  return (
    <header className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
          
          {/* Left Navigation - AirHUD */}
          <nav className="font-manrope mr-8">
            <a 
              href="https://airhud.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brandorange font-medium transition-colors text-lg"
            >
              AirHUD
            </a>
          </nav>
          
          {/* Centered Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://energized-canvas-6b08f4eb08.media.strapiapp.com/anarky_Labs_Logo_White_794a742632.jpg"
              alt="Anarky Labs"
              className="h-[200px] w-[170px] object-contain"
            />
          </div>
          
          {/* Right Navigation - AirSkill */}
          <nav className="font-manrope ml-8">
            <a 
              href="https://airskill.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-brandorange font-medium transition-colors text-lg"
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