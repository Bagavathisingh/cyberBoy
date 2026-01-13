import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, UserPlus, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black overflow-hidden font-cyber">
      {/* Immersive Background Layers */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -45, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-cyber-secondary/10 blur-[180px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 60, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-cyber-accent/10 blur-[180px] rounded-full"
        />
      </div>

      <div className="w-full max-w-[1200px] relative z-10 px-6 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
        {/* Massive Title Side */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 text-center md:text-left pt-20 md:pt-0"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyber-border bg-white/5 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-cyber-accent" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-cyber-muted">New Node Discovery</span>
          </div>
          <h1 className="zentry-title mb-8 text-cyber-text">
            JOIN <br />
            THE <span className="special-font text-cyber-text">NETWORK</span>
          </h1>
          <p className="text-cyber-muted text-sm md:text-lg max-sm font-medium leading-relaxed">
            Initialize your profile on the Radiant protocol. Expand the neural intelligence collective.
          </p>
        </motion.div>

        {/* Register Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ rotateY: -5, rotateX: 2 }}
          className="w-full max-w-[480px]"
        >
          <div className="bento-card p-10 md:p-14 border-white/10 bg-[#0A0A0A]/80 shadow-2xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-cyber-secondary rounded-2xl flex items-center justify-center -rotate-6 shadow-[0_0_20px_rgba(87,36,255,0.4)]">
                <UserPlus className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black font-zentry tracking-tight text-white uppercase italic">Registration</h2>
                <p className="text-[9px] text-cyber-muted font-bold tracking-[0.3em] uppercase">Status: Awaiting Signal</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-[10px] font-bold uppercase tracking-wider text-center"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-cyber-success/10 border border-cyber-success/20 rounded-2xl text-cyber-success text-[10px] font-bold uppercase tracking-wider text-center"
                >
                  Registration Successful! Redirecting...
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyber-accent transition-colors" />
                  <input
                    type="email"
                    placeholder="CHOOSE_IDENTIFIER"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-5 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-cyber-accent focus:bg-white/[0.05] transition-all"
                    required
                    disabled={loading || success}
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyber-accent transition-colors" />
                  <input
                    type="password"
                    placeholder="SECURE_PASSCODE"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-12 py-5 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-cyber-accent focus:bg-white/[0.05] transition-all"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="zentry-button w-full flex items-center justify-center gap-3 group"
              >
                <span>{loading ? "Provisioning..." : success ? "Provisioned" : "Initialize Link"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-8 border-t border-cyber-border flex flex-col items-center gap-4">
                <p className="text-cyber-muted text-[10px] font-bold tracking-widest uppercase">
                  Already Linked?
                  <Link to="/login" className="ml-2 text-cyber-text hover:text-cyber-accent transition-colors font-black">
                    SignIn to Void
                  </Link>
                </p>
                <div className="flex gap-4 opacity-10">
                  <div className="w-8 h-px bg-white" />
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <div className="w-8 h-px bg-white" />
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;


