import React, { useState } from "react";
import CameraView from "./components/CameraView";

// Menu Component
function Menu({ onSelectOption }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      {/* Header */}
      <header className="bg-white p-5 text-center shadow-md">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img 
            src="https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg" 
            alt="Vista Eye Logo"
            className="w-16 h-16 rounded-full object-cover border-3 border-sky-400"
          />
          <span className="text-3xl font-bold text-sky-500 tracking-wider">VISTA EYE</span>
        </div>
        <p className="text-slate-500">Hệ thống mô phỏng & hỗ trợ thị giác</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Chào mừng bạn đến với VISTA EYE</h2>
          <p className="text-slate-500 text-lg">Vui lòng chọn chức năng bạn muốn sử dụng</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-lg">
          {/* Option 1: Eye Simulation */}
          <a 
            href="/eye-simulation.html"
            className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-sky-400 no-underline"
          >
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
            >
              👁️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Trải nghiệm mô phỏng tật về mắt</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Mô phỏng các tật khuyết thị giác như cận thị, loạn thị, mù màu và các bệnh lý về mắt khác.</p>
            </div>
            <span className="text-2xl text-slate-300 transition-all duration-300">→</span>
          </a>

          {/* Option 2: Camera Capture */}
          <button 
            onClick={() => onSelectOption('camera')}
            className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-sky-400 text-left w-full"
          >
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00ff88, #10b981)' }}
            >
              📸
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Camera lưu trữ khoảnh khắc</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Chụp và lưu trữ hình ảnh khoảnh khắc đáng nhớ của bạn lên hệ thống cloud.</p>
            </div>
            <span className="text-2xl text-slate-300 transition-all duration-300">→</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-5 text-slate-500 text-sm border-t border-slate-200">
        <p>© 2025 VISTA EYE - Hệ thống mô phỏng tật khuyết thị giác</p>
      </footer>
    </div>
  );
}

// Camera Page Component
function CameraPage({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50/50">
      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 py-3 px-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-sky-500 font-semibold px-4 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors"
            >
              ← Quay lại
            </button>
            <img 
              src="https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg" 
              alt="Vista Eye Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-100"
            />
            <div>
              <h1 className="text-lg font-semibold text-sky-700">VISTA EYE</h1>
              <p className="text-xs text-sky-500">📸 Camera lưu trữ khoảnh khắc</p>
            </div>
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

function App() {
  const [currentPage, setCurrentPage] = useState('menu');

  if (currentPage === 'camera') {
    return (
      <CameraPage
        onBack={() => {
          window.location.href = 'https://vistapatientjourney.vercel.app/knowledge';
        }}
      />
    );
  }

  return <Menu onSelectOption={setCurrentPage} />;
}

export default App;
