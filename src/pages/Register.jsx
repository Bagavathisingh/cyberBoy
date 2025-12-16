import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:bg-prime-bg dark:bg-none px-2 sm:px-0">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/50 dark:bg-prime-surface p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-purple-500/30 dark:border-prime-accent"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-prime-text mb-6 text-center">
          Register
        </h2>
        {error && (
          <div className="text-red-400 dark:text-prime-danger mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-400 dark:text-prime-accent mb-4 text-center">
            Registration successful! Redirecting...
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-3 sm:px-4 rounded-xl bg-slate-700/80 dark:bg-prime-bg text-white dark:text-prime-text border border-slate-600 dark:border-prime-accent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-prime-accent text-base sm:text-lg"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-3 sm:px-4 rounded-xl bg-slate-700/80 dark:bg-prime-bg text-white dark:text-prime-text border border-slate-600 dark:border-prime-accent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-prime-accent text-base sm:text-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-prime-accent dark:hover:bg-prime-accent-dark text-white py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-prime-accent text-base sm:text-lg"
        >
          Register
        </button>
        <p className="text-purple-300 dark:text-prime-muted mt-4 text-center text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
