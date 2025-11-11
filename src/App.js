import React from "react";
import CameraView from "./components/CameraView";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header với gradient đẹp - COMPACT */}
      <div className="w-full bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 py-6 shadow-xl">
        <div className="max-w-[1800px] mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <img 
              src="https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg" 
              alt="Vista Eye Logo"
              className="w-16 h-16 rounded-full object-cover shadow-2xl border-4 border-white/90 transition-transform hover:scale-110"
            />
            <h1 className="text-5xl font-extrabold text-gray-800 text-center drop-shadow-lg">
              VISTA EYE
            </h1>
          </div>
          <p className="text-center text-gray-700 text-lg max-w-3xl mx-auto font-semibold mb-1">
            Vision Interactive Simulation & Try-on Application
          </p>
          <p className="text-center text-gray-600 text-sm max-w-3xl mx-auto">
            Trải nghiệm nhìn thế giới qua đôi mắt khác nhau. Thử mắt kính và filter để chụp "chân dung thị giác" của bạn 🌟
          </p>
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
