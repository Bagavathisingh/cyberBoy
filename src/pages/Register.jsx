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
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg relative overflow-hidden px-4">
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(245,158,11,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 border border-cyber-accent/30 bg-cyber-accent/5 rotate-45 mb-10">
            <div className="w-6 h-6 border-2 border-cyber-accent -rotate-45 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
          <h1 className="text-3xl font-black font-orbitron tracking-tighter text-white uppercase">
            Provision_<span className="text-cyber-accent">ID</span>
          </h1>
          <p className="text-[9px] font-mono text-cyber-muted tracking-[0.5em] uppercase mt-2">Neural_Node_Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest text-center">
              [ ERROR ]: {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-cyber-success/5 border border-cyber-success/20 text-cyber-success text-[10px] font-mono uppercase tracking-widest text-center">
              [ SUCCESS ]: Node_Provisioned.
            </div>
          )}

          <div className="space-y-4">
            <div className="group">
              <label className="text-[9px] font-orbitron font-bold text-cyber-muted uppercase tracking-[0.3em] mb-2 block">Ident_Address</label>
              <input
                type="email"
                placeholder="RECRUIT@SYSTEM.NET"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-cyber-border px-5 py-4 text-sm font-cyber focus:outline-none focus:border-cyber-accent transition-all duration-500 placeholder-cyber-muted/20"
                required
              />
            </div>

            <div className="group">
              <label className="text-[9px] font-orbitron font-bold text-cyber-muted uppercase tracking-[0.3em] mb-2 block">Secure_Key</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-cyber-border px-5 py-4 text-sm font-cyber focus:outline-none focus:border-cyber-accent transition-all duration-500 placeholder-cyber-muted/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="cyber-button w-full py-5 font-black text-xs tracking-[0.4em]"
          >
            INITIALIZE_ID
          </button>

          <p className="text-center text-[10px] font-orbitron text-cyber-muted uppercase tracking-widest mt-8">
            Already_Active?{" "}
            <a href="/login" className="text-cyber-accent hover:text-white transition-colors underline underline-offset-4">
              Access_Node
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
