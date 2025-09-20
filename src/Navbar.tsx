import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="container mx-auto px-6 py-5 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">श्</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <Link
                to="/"
                className="text-2xl font-light text-slate-800 tracking-tight hover:text-slate-600 transition-all duration-300 leading-none"
              >
                श्लोक Retrospective
              </Link>
              <span className="text-xs text-slate-400 font-light tracking-wide">
                Nepali Chhanda Analysis
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-white-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              <span className="relative z-10">गृहपृष्ठ</span>
              {location.pathname === "/" && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl"></div>
              )}
            </Link>

            <Link
              to="/about"
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/about"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              <span className="relative z-10">परिचय</span>
              {location.pathname === "/about" && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl"></div>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200/60 mx-2"></div>

            {/* Action Button */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500 font-medium">सक्रिय</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>
    </nav>
  );
}
