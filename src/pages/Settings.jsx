import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";

function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("cyberboy_theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("cyberboy_user");
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
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg relative overflow-hidden px-4">
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black font-orbitron tracking-tighter text-white uppercase">
            System_<span className="text-cyber-accent">Protocols</span>
          </h1>
          <p className="text-[9px] font-mono text-cyber-muted tracking-[0.5em] uppercase mt-2">Node_Configuration</p>
        </div>

        <div className="p-8 border border-cyber-border bg-white/[0.01] space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-orbitron font-bold text-cyber-muted tracking-widest uppercase mb-4">Identity_Management</h3>
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="cyber-button w-full border-cyber-muted text-cyber-muted hover:border-cyber-accent hover:text-cyber-accent"
            >
              Terminate_Session
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-cyber-border">
            <h3 className="text-[10px] font-orbitron font-bold text-cyber-muted tracking-widest uppercase mb-4">Theme_Override</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange("dark")}
                className={`py-3 text-[10px] font-orbitron tracking-widest uppercase transition-all ${theme === "dark" ? "bg-cyber-accent text-cyber-bg font-black" : "border border-cyber-border text-cyber-muted"
                  }`}
              >
                Dark_Mode
              </button>
              <button
                onClick={() => handleThemeChange("light")}
                className={`py-3 text-[10px] font-orbitron tracking-widest uppercase transition-all ${theme === "light" ? "bg-cyber-accent text-cyber-bg font-black" : "border border-cyber-border text-cyber-muted"
                  }`}
              >
                Light_Mode
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-cyber-border">
            <h3 className="text-[10px] font-orbitron font-bold text-red-500/50 tracking-widest uppercase mb-4">Danger_Zone</h3>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-4 border border-red-500/30 text-red-500/70 hover:bg-red-500/10 text-[10px] font-orbitron tracking-[0.3em] uppercase transition-all"
              disabled={deleting}
            >
              Purge_Local_ID
            </button>
          </div>
        </div>

        <ConfirmModal
          open={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
          title="TERMINATE_SESSION"
          message="Are you sure you want to terminate the current identity session?"
          confirmText="TERMINATE"
          confirmColor="bg-cyber-accent text-cyber-bg"
        />
        <ConfirmModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="PURGE_IDENTITY"
          message="This will permanently delete your node credentials from the local array. Continue?"
          confirmText="PURGE"
          confirmColor="bg-red-600 text-white"
        />
      </div>
    </div>
  );
}

export default Settings;
