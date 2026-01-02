import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-cyber-bg/80 border-b border-cyber-border backdrop-blur-xl relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 border border-cyber-accent bg-cyber-accent/10 flex items-center justify-center relative overflow-hidden group-hover:bg-cyber-accent/20 transition-colors" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)' }}>
                <span className="text-cyber-accent font-orbitron font-bold text-sm cyber-text-glow">CB</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </div>
              <div>
                <span className="text-xl font-orbitron font-black tracking-tighter text-white group-hover:text-cyber-accent transition-colors">
                  CYBER <span className="text-cyber-accent">BOY</span>
                </span>
                <div className="h-[2px] w-0 group-hover:w-full bg-cyber-accent transition-all duration-300" />
              </div>
            </Link>
            <button
              className="sm:hidden p-2 ml-auto text-cyber-accent border border-cyber-accent/30 rounded-sm hover:bg-cyber-accent/10 transition-colors"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 shadow-[0_0_5px_rgba(0,242,255,0.5)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          <div
            className={`flex-col sm:flex-row gap-2 w-full sm:w-auto flex ${menuOpen ? "flex animate-in fade-in slide-in-from-top-4 duration-300" : "hidden"
              } sm:flex items-center`}
          >
            {[
              { to: "/", label: "H_INTERFACE" },
              { to: "/dashboard", label: "D_ANALYSIS" },
              { to: "/settings", label: "S_CONFIG" }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-[10px] font-orbitron tracking-[0.2em] transition-all duration-300 relative border border-transparent hover:border-cyber-accent/50 hover:bg-cyber-accent/5 ${isActive(link.to)
                    ? "text-cyber-accent border-cyber-accent/30 bg-cyber-accent/10 cyber-text-glow"
                    : "text-cyber-muted hover:text-cyber-text"
                  }`}
                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                onClick={() => setMenuOpen(false)}
              >
                {isActive(link.to) && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-cyber-accent animate-pulse" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
