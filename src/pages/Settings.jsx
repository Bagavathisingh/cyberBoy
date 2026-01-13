import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Trash2,
  Moon,
  Sun,
  Settings as SettingsIcon,
  ShieldAlert,
  Cpu,
  Fingerprint
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("cyberboy_theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem("cyberboy_session_id");
      if (sessionId) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        await fetch(`${BACKEND_URL}/api/sessions/${sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endedAt: new Date() }),
        });
      }
    } catch (error) {
      console.error("Failed to close session:", error);
    }
    localStorage.removeItem("cyberboy_user");
    localStorage.removeItem("cyberboy_session_id");
    setLogoutModalOpen(false);
    navigate("/login");
  };

  const handleThemeChange = (mode) => {
    setTheme(mode);
    localStorage.setItem("cyberboy_theme", mode);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const user = JSON.parse(localStorage.getItem("cyberboy_user"));
      if (user && user._id) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        await fetch(`${BACKEND_URL}/api/auth/delete/${user._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
      }
      localStorage.removeItem("cyberboy_user");
      setModalOpen(false);
      navigate("/register");
    } catch (err) {
      setModalOpen(false);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-cyber overflow-hidden p-6 md:p-12 pt-32 relative">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyber-accent/5 blur-[250px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-3xl">
            <SettingsIcon className="w-3.5 h-3.5 text-cyber-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Core Array Config</span>
          </div>
          <h1 className="zentry-title mb-6">
            CORE <br />
            <span className="special-font text-white">PROTOCOL</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bento-card p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform">
                <Fingerprint className="w-8 h-8 text-white/40" />
              </div>
              <h2 className="text-2xl font-black font-zentry uppercase italic mb-4">Identity</h2>
              <p className="text-cyber-muted text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-12">
                Manage your neural identifier and active transmission sessions.
              </p>
            </div>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className="zentry-button w-full flex items-center justify-center gap-3"
            >
              <LogOut size={16} />
              <span>Terminate Session</span>
            </button>
          </motion.div>

          {/* Interface Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bento-card p-10 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center mb-10">
                <Cpu className="w-8 h-8 text-cyber-accent" />
              </div>
              <h2 className="text-2xl font-black font-zentry uppercase italic mb-4">Interface</h2>
              <p className="text-cyber-muted text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-12">
                Customize the visual frequency of the neural uplink interface.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-5 rounded-2xl flex flex-col items-center gap-4 transition-all border ${theme === 'dark'
                    ? 'bg-cyber-accent border-cyber-accent text-black shadow-[0_0_30px_rgba(237,255,102,0.2)]'
                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                  }`}
              >
                <Moon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-5 rounded-2xl flex flex-col items-center gap-4 transition-all border ${theme === 'light'
                    ? 'bg-cyber-accent border-cyber-accent text-black shadow-[0_0_30px_rgba(237,255,102,0.2)]'
                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                  }`}
              >
                <Sun size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
              </button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ rotateY: 5 }}
            className="bento-card p-10 border-red-500/20 bg-red-500/[0.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 bg-red-500/10 rounded-3xl flex items-center justify-center mb-10">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-black font-zentry uppercase italic mb-4 text-red-500">Purge</h2>
              <p className="text-red-900/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-12">
                Permanently eliminate all neural history and stored identity metrics.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              disabled={deleting}
              className="w-full py-5 rounded-full border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
            >
              {deleting ? "PURGING..." : "EXECUTE_PURGE"}
            </button>
          </motion.div>
        </div>
      </div>

      <ConfirmModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="TERMINATE SESSION"
        message="Are you sure you want to terminate the current identity session? All active neural links will be closed."
        confirmText="TERMINATE"
        confirmColor="bg-cyber-accent text-cyber-bg"
      />
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="PURGE IDENTITY"
        message="This action is irreversible. It will permanently delete your node credentials from the local array. Continue?"
        confirmText="PURGE NOW"
        confirmColor="bg-red-600 text-white"
      />
    </div>
  );
}

export default Settings;


