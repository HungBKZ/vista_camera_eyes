import React from "react";
import CameraView from "./components/CameraView";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50/50">
      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 py-3 px-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg" 
              alt="Vista Eye Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-100"
            />
            <div>
              <h1 className="text-lg font-semibold text-sky-700">VISTA EYE</h1>
              <p className="text-xs text-sky-500">Mô phỏng tật khuyết thị giác</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-sky-600">Hệ thống hỗ trợ chẩn đoán</p>
            <p className="text-xs text-sky-400">Phòng khám mắt chuyên khoa</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <CameraView />
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-sky-100 py-4">
        <div className="text-center text-sky-500 text-xs">
          <p>© 2025 VISTA EYE - Hệ thống mô phỏng tật khuyết thị giác</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
