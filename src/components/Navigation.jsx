import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, Terminal, Settings as SettingsIcon, LayoutGrid } from "lucide-react";

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/", label: "Neural", icon: <Terminal size={14} /> },
    { to: "/dashboard", label: "Analytics", icon: <LayoutGrid size={14} /> },
    { to: "/settings", label: "Core", icon: <SettingsIcon size={14} /> }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] p-6 pointer-events-none">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-cyber-accent rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(237,255,102,0.3)]">
              <Rocket className="text-black w-5 h-5" />
            </div>
            <span className="font-zentry text-2xl font-black tracking-tighter text-cyber-text">
              CYBER<span className="text-cyber-accent italic">BOY</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-1 p-1 bg-cyber-panel backdrop-blur-3xl rounded-full border border-cyber-border pointer-events-auto shadow-2xl"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${isActive(link.to) ? "text-black" : "text-cyber-muted hover:text-cyber-text"
                }`}
            >
              <span className="relative z-10">{link.label}</span>
              {isActive(link.to) && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-cyber-accent rounded-full"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </motion.div>

        {/* Mobile Toggle */}
        <div className="md:hidden pointer-events-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-12 h-12 rounded-2xl bg-cyber-panel border border-cyber-border flex items-center justify-center text-cyber-text"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-cyber-bg z-[90] p-12 flex flex-col justify-center pointer-events-auto"
          >
            <div className="space-y-8">
              {links.map((link, idx) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="zentry-title text-6xl hover:text-cyber-accent transition-colors block text-cyber-text"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;



