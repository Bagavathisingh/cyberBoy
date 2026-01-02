import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-cyber-bg/95 border-b border-cyber-border backdrop-blur-2xl relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.svg" alt="App Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,255,157,0.5)] transition-transform duration-500 group-hover:rotate-180" />
              <span className="text-lg font-orbitron font-black tracking-widest text-cyber-text">
                CYBER<span className="text-cyber-accent"> BOY</span>
              </span>
            </Link>
            <button
              className="sm:hidden p-2 text-cyber-muted hover:text-cyber-accent transition-colors"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
          <div
            className={`${menuOpen ? "flex animate-in fade-in slide-in-from-top-2" : "hidden"
              } sm:flex flex-col sm:flex-row gap-6 items-center`}
          >
            {[
              { to: "/", label: "Interface" },
              { to: "/dashboard", label: "Analysis" },
              { to: "/settings", label: "Protocol" }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[10px] font-orbitron uppercase tracking-[0.3em] font-bold transition-all duration-300 relative ${isActive(link.to)
                  ? "text-cyber-accent"
                  : "text-cyber-muted hover:text-cyber-text"
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-2 left-0 w-full h-px bg-cyber-accent shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
