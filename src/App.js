import React, { useEffect, useState } from "react";
import CameraView from "./components/CameraView";

// Camera Page Component
function CameraPage({ onBack }) {
  const LANG_STORAGE_KEY = 'see_beyond_lang';
  const [lang, setLang] = useState(() => {
    try {
      const saved = String(localStorage.getItem(LANG_STORAGE_KEY) || 'vi').toLowerCase();
      return saved === 'en' ? 'en' : 'vi';
    } catch {
      return 'vi';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col bg-sky-50/50">
      {/* Header */}
      <header className="w-full bg-white border-b border-sky-100 py-3 px-4">
        <div className="w-full flex items-center justify-between">
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
              <p className="text-xs text-sky-500">
                📸 {lang === 'en' ? 'Vision Camera' : 'Máy ảnh thị giác'}
              </p>
            </div>
          </div>

          {/* Language (top-right) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-sky-700 hidden sm:inline">{lang === 'en' ? 'Language' : 'Ngôn ngữ'}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value === 'en' ? 'en' : 'vi')}
              className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1.5"
              aria-label={lang === 'en' ? 'Language' : 'Ngôn ngữ'}
            >
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <CameraView lang={lang} setLang={setLang} />
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
  return (
    <CameraPage
      onBack={() => {
        window.location.href = 'https://vistapatientjourney.vercel.app/knowledge';
      }}
    />
  );
}

export default App;
