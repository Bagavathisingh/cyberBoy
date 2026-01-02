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
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg cyber-grid-bg px-4 relative overflow-hidden">
      <div className="scanline" />

      {/* Background Decor */}
      <div className="absolute top-20 right-20 w-40 h-40 border-2 border-cyber-accent/10 rotate-45 animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 border border-cyber-secondary/5 rounded-full animate-pulse [animation-duration:15s]" />

      <form
        onSubmit={handleSubmit}
        className="cyber-box p-6 sm:p-10 w-full max-w-md relative z-10 before:content-['SEC_REG'] before:absolute before:-top-3 before:left-10 before:bg-cyber-bg before:px-2 before:text-[10px] before:text-cyber-secondary before:font-orbitron before:tracking-[0.2em]"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-orbitron tracking-tighter cyber-text-glow-alt mb-2" style={{ textShadow: '0 0 10px rgba(255, 0, 234, 0.5)' }}>
            NEW_RECRUIT
          </h2>
          <div className="h-[2px] w-20 bg-cyber-secondary mx-auto" />
        </div>

        {error && (
          <div className="bg-cyber-secondary/10 border border-cyber-secondary/50 text-cyber-secondary px-4 py-3 mb-6 text-center text-xs font-mono animate-flicker">
            [FATAL_EXCEPTION]: {error}
          </div>
        )}

        {success && (
          <div className="bg-cyber-success/10 border border-cyber-success/50 text-cyber-success px-4 py-3 mb-6 text-center text-xs font-mono">
            [SUCCESS]: NODE_PROVISIONED. REDIRECTING...
          </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] font-orbitron text-cyber-muted uppercase tracking-widest mb-1 block">IDENT_ADDRESS</label>
            <input
              type="email"
              placeholder="e.g. recruit_01@nexus.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cyber-bg/50 border border-cyber-border text-cyber-accent placeholder-cyber-muted/30 px-4 py-4 focus:outline-none focus:border-cyber-secondary transition-colors font-cyber text-sm"
              required
            />
          </div>

          <div className="relative">
            <label className="text-[10px] font-orbitron text-cyber-muted uppercase tracking-widest mb-1 block">NEW_ACCESS_KEY</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-bg/50 border border-cyber-border text-cyber-accent placeholder-cyber-muted/30 px-4 py-4 focus:outline-none focus:border-cyber-secondary transition-colors font-cyber text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="cyber-button w-full py-4 mt-4 font-bold tracking-[0.3em] group border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-white"
            style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}
          >
            <span className="group-hover:animate-pulse">PROVISION_ID</span>
          </button>
        </div>

        <p className="text-cyber-muted mt-8 text-center text-[10px] font-orbitron tracking-widest uppercase">
          ALREADY_IDENTIFIED?{" "}
          <a href="/login" className="text-cyber-accent hover:text-cyber-secondary underline underline-offset-4 transition-colors">
            ACCESS_TERMINAL
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
