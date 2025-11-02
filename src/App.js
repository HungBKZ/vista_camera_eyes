import React from "react";
import CameraView from "./components/CameraView";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header với gradient đẹp */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-8 shadow-xl mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-white text-center mb-3 drop-shadow-lg">
            ✨ SeeBeyond – Light Odyssey
          </h1>
          <p className="text-center text-white/90 text-lg max-w-2xl mx-auto font-medium">
            Trải nghiệm nhìn thế giới qua đôi mắt khác nhau.  
            Hãy chọn mắt kính và filter để chụp "chân dung thị giác" của riêng bạn 🌟
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl">
        <CameraView />
      </div>

      {/* Footer */}
      <footer className="w-full bg-white/50 backdrop-blur-sm py-6 mt-12 border-t border-gray-200">
        <div className="text-center text-gray-600 text-sm">
          <p className="font-medium">Made with ❤️ for everyone</p>
          <p className="mt-1">© 2025 SeeBeyond Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
