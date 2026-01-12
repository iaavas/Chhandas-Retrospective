import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "./contexts/LanguageContext";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, currentLanguage, changeLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === "ne" ? "en" : "ne");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-medium text-slate-800 hover:text-slate-600"
            onClick={closeMenu}
          >
            छन्द
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-base ${
                isActive("/")
                  ? "text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("nav.home")}
            </Link>

            <Link
              to="/test"
              className={`text-base ${
                isActive("/test")
                  ? "text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("nav.test")}
            </Link>

            <Link
              to="/examples"
              className={`text-base ${
                isActive("/examples")
                  ? "text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("nav.examples")}
            </Link>

            <Link
              to="/about"
              className={`text-base ${
                isActive("/about")
                  ? "text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("nav.about")}
            </Link>

            <button
              onClick={toggleLanguage}
              className="text-base text-slate-500 hover:text-slate-700"
            >
              {currentLanguage === "ne" ? "EN" : "ने"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-1"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block w-5 h-0.5 bg-slate-600 transition-transform ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-slate-600 transition-opacity ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-slate-600 transition-transform ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-slate-100 mt-3">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`block py-2 text-base ${
                  isActive("/")
                    ? "text-slate-900 font-medium"
                    : "text-slate-600"
                }`}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/test"
                onClick={closeMenu}
                className={`block py-2 text-base ${
                  isActive("/test")
                    ? "text-slate-900 font-medium"
                    : "text-slate-600"
                }`}
              >
                {t("nav.test")}
              </Link>
              <Link
                to="/examples"
                onClick={closeMenu}
                className={`block py-2 text-base ${
                  isActive("/examples")
                    ? "text-slate-900 font-medium"
                    : "text-slate-600"
                }`}
              >
                {t("nav.examples")}
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className={`block py-2 text-base ${
                  isActive("/about")
                    ? "text-slate-900 font-medium"
                    : "text-slate-600"
                }`}
              >
                {t("nav.about")}
              </Link>

              <button
                onClick={toggleLanguage}
                className="block py-2 text-base text-slate-600"
              >
                {currentLanguage === "ne"
                  ? "Switch to English"
                  : "नेपालीमा बदल्नुहोस्"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
