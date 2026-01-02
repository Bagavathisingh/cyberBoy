import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
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
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg cyber-grid-bg px-4 relative overflow-hidden">
      <div className="scanline" />

      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-cyber-accent/10 rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 border border-cyber-secondary/5 border-dashed rounded-full animate-spin [animation-duration:20s]" />

      <form
        onSubmit={handleSubmit}
        className="cyber-box p-6 sm:p-10 w-full max-w-md relative z-10 before:content-['IDENT_REQ'] before:absolute before:-top-3 before:left-10 before:bg-cyber-bg before:px-2 before:text-[10px] before:text-cyber-accent before:font-orbitron before:tracking-[0.2em]"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-orbitron tracking-tighter cyber-text-glow mb-2">
            TERMINAL_LOGIN
          </h2>
          <div className="h-[2px] w-20 bg-cyber-accent mx-auto" />
        </div>

        {error && (
          <div className="bg-cyber-secondary/10 border border-cyber-secondary/50 text-cyber-secondary px-4 py-3 mb-6 text-center text-xs font-mono animate-flicker">
            [ERROR]: {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-orbitron text-cyber-muted uppercase tracking-widest mb-1 block">USER_EMAIL_IDENT</label>
            <input
              type="email"
              placeholder="e.g. operator@nexus.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cyber-bg/50 border border-cyber-border text-cyber-accent placeholder-cyber-muted/30 px-4 py-4 focus:outline-none focus:border-cyber-accent transition-colors font-cyber text-sm"
              required
            />
          </div>

          <div className="relative">
            <label className="text-[10px] font-orbitron text-cyber-muted uppercase tracking-widest mb-1 block">ACCESS_KEY_ENCRYPT</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-bg/50 border border-cyber-border text-cyber-accent placeholder-cyber-muted/30 px-4 py-4 focus:outline-none focus:border-cyber-accent transition-colors font-cyber text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="cyber-button w-full py-4 mt-4 font-bold tracking-[0.3em] group"
          >
            <span className="group-hover:animate-pulse">AUTHENTICATE</span>
          </button>
        </div>

        <p className="text-cyber-muted mt-8 text-center text-[10px] font-orbitron tracking-widest uppercase">
          NEW_USER?{" "}
          <a href="/register" className="text-cyber-secondary hover:text-cyber-accent underline underline-offset-4 transition-colors">
            CREATE_SEC_ID
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
