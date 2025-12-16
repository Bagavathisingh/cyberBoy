import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 mb-2 sm:mb-0 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">
                Cyber Boy
              </span>
            </div>
            <button
              className="sm:hidden p-2 ml-auto text-white focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div
            className={`flex-col sm:flex-row gap-1 sm:gap-2 w-full sm:w-auto flex ${
              menuOpen ? "flex" : "hidden"
            } sm:flex`}
          >
            <Link
              to="/"
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-center ${
                isActive("/")
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Chatbot
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-center ${
                isActive("/dashboard")
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-200 text-center ${
                isActive("/settings")
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
