import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base sm:text-lg">
                  छ
                </span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <Link
                to="/"
                className="text-lg sm:text-2xl font-light text-slate-800 tracking-tight hover:text-slate-600 transition-all duration-300 leading-none"
                onClick={closeMenu}
              >
                छन्द Retrospective
              </Link>
              <span className="text-xs text-slate-400 font-light tracking-wide hidden sm:block">
                Nepali Chhanda Analysis
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              <span className="relative z-10">गृहपृष्ठ</span>
              {location.pathname === "/" && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl"></div>
              )}
            </Link>

            <Link
              to="/test"
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/test"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              <span className="relative z-10">परीक्षण</span>
              {location.pathname === "/test" && (
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Status Indicator */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500 font-medium">सक्रिय</span>
            </div>

            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-slate-100/80 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                <span
                  className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-40 opacity-100 mt-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-3 space-y-2 border-t border-slate-200/60">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              गृहपृष्ठ
            </Link>
            <Link
              to="/test"
              onClick={closeMenu}
              className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/test"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              परीक्षण
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                location.pathname === "/about"
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              परिचय
            </Link>
            <div className="px-4 py-2">
              <span className="text-xs text-slate-400 font-light tracking-wide">
                Nepali Chhanda Analysis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>
    </nav>
  );
}
