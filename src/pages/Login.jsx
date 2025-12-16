import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("cyberboy_user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:bg-gradient-to-br dark:from-prime-bg-gradient-from dark:to-prime-bg-gradient-to px-2 sm:px-0">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/50 dark:bg-prime-surface p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30 dark:border-prime-border"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-prime-text-strong mb-6 text-center tracking-wide">
          Login
        </h2>
        {error && (
          <div className="text-red-400 dark:text-prime-danger mb-4 text-center">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-3 sm:px-4 rounded-xl bg-slate-700/80 dark:bg-prime-surface-2 text-white dark:text-prime-text border border-slate-600 dark:border-prime-border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-prime-accent text-base sm:text-lg shadow-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-3 sm:px-4 rounded-xl bg-slate-700/80 dark:bg-prime-surface-2 text-white dark:text-prime-text border border-slate-600 dark:border-prime-border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-prime-accent text-base sm:text-lg shadow-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700 hover:from-cyan-600 hover:to-blue-800 dark:bg-gradient-to-r dark:from-blue-400 dark:via-cyan-500 dark:to-blue-700 text-white py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base sm:text-lg shadow-md dark:shadow-cyan-500/30"
        >
          Login
        </button>
        <p className="text-purple-300 dark:text-prime-muted-2 mt-4 text-center text-sm sm:text-base">
          Don't have an account?{" "}
          <a href="/register" className="underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
