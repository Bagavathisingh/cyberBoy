import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";

function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("cyberboy_theme") || "dark"
  );

  // Ensure theme class is set on <html> on mount and when theme changes
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
        await fetch(`http://localhost:5000/api/auth/delete/${user._id}`, {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:bg-gradient-to-br dark:from-prime-bg-gradient-from dark:to-prime-bg-gradient-to px-2 sm:px-0">
      <div className="bg-slate-800/50 dark:bg-prime-surface p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-purple-500/30 dark:border-prime-accent">
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-prime-text mb-6 text-center">
          Settings
        </h2>
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-prime-accent dark:hover:bg-prime-accent-dark text-white py-3 rounded-xl font-semibold mb-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-prime-accent text-base sm:text-lg"
        >
          Log Out
        </button>
        <div className="flex justify-between items-center mb-4">
          <span className="text-white dark:text-prime-text">Theme:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleThemeChange("dark")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                theme === "dark"
                  ? "bg-prime-accent text-white"
                  : "bg-slate-700/80 dark:bg-prime-bg text-gray-300 dark:text-prime-muted hover:bg-purple-700 hover:text-white dark:hover:bg-prime-accent-dark"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("light")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                theme === "light"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700/80 text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
            >
              Light
            </button>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-prime-danger dark:hover:bg-red-700 text-base sm:text-lg"
          disabled={deleting}
        >
          Delete Account
        </button>
        <ConfirmModal
          open={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
          title="Log Out"
          message="Are you sure you want to log out?"
          confirmText="Log Out"
          confirmColor="bg-purple-600 hover:bg-purple-700"
        />
        <ConfirmModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          confirmText="Delete"
          confirmColor="bg-red-600 hover:bg-red-700"
        />
      </div>
    </div>
  );
}

export default Settings;
