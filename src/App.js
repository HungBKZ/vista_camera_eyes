import React, { useState } from "react";
import CameraView from "./components/CameraView";

function App() {
  const [headerExpanded, setHeaderExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header COMPACT - chi hien logo + ten */}
      <div 
        className={`w-full bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 shadow-xl transition-all duration-300 ${
          headerExpanded ? 'py-6' : 'py-2'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-4">
          <div 
            className="flex items-center justify-center gap-3 cursor-pointer"
            onClick={() => setHeaderExpanded(!headerExpanded)}
          >
            <img 
              src="https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg" 
              alt="Vista Eye Logo"
              className={`rounded-full object-cover shadow-xl border-2 border-white/90 transition-all duration-300 ${
                headerExpanded ? 'w-14 h-14' : 'w-10 h-10'
              }`}
            />
            <h1 className={`font-extrabold text-gray-800 drop-shadow-lg transition-all duration-300 ${
              headerExpanded ? 'text-4xl' : 'text-2xl'
            }`}>
              VISTA EYE
            </h1>
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${headerExpanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Phan mo rong khi click */}
          <div className={`overflow-hidden transition-all duration-300 ${
            headerExpanded ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}>
            <p className="text-center text-gray-700 text-base max-w-3xl mx-auto font-semibold mb-1">
              Vision Interactive Simulation & Try-on Application
            </p>
            <p className="text-center text-gray-600 text-sm max-w-3xl mx-auto">
              Trai nghiem nhin the gioi qua doi mat khac nhau. Thu mat kinh va filter de chup "chan dung thi giac" cua ban
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - FULL WIDTH */}
      <div className="flex-1 w-full">
        <CameraView />
      </div>

      {/* Footer */}
      <footer className="w-full bg-white/50 backdrop-blur-sm py-6 mt-12 border-t border-gray-200">
        <div className="text-center text-gray-600 text-sm">
          <p className="font-medium">Made with ❤️ for everyone</p>
          <p className="mt-1">© 2025 VISTA EYE Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
