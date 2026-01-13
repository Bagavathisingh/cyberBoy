import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getChatbotData, formatTimeAgo } from "../utils/chatbotData";
import { Activity, Zap, Shield, Database, LayoutPanelLeft, ArrowUpRight } from "lucide-react";

function Dashboard() {
  const [chatbotData, setChatbotData] = useState(getChatbotData());

  useEffect(() => {
    const interval = setInterval(() => {
      setChatbotData(getChatbotData());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const successRate =
    chatbotData.totalQueries > 0
      ? (
        ((chatbotData.totalQueries -
          chatbotData.recentActivity.filter((a) => a.type === "error")
            .length) /
          chatbotData.totalQueries) *
        100
      ).toFixed(1)
      : 100;

  const stats = [
    { label: "Total Uplinks", value: chatbotData.totalQueries.toLocaleString(), icon: <Shield className="w-5 h-5" />, color: "text-cyber-accent" },
    { label: "Neural Traffic", value: chatbotData.totalMessages.toLocaleString(), icon: <Zap className="w-5 h-5" />, color: "text-white" },
    { label: "Operator Input", value: chatbotData.totalUserMessages.toLocaleString(), icon: <Database className="w-5 h-5" />, color: "text-white" },
    { label: "Accuracy", value: `${successRate}%`, icon: <Activity className="w-5 h-5" />, color: "text-cyber-success" },
  ];

  const recentActivity = chatbotData.recentActivity.slice(0, 6);

  return (
    <div className="min-h-screen bg-cyber-bg p-4 md:p-8 pt-24 md:pt-32 relative overflow-hidden text-cyber-text font-cyber">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyber-accent/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyber-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-12 md:space-y-24">
        {/* Massive Zentry Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center md:text-left pt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-cyber-muted">Node Status: Optimized</span>
          </div>

          <h1 className="zentry-title mb-6">
            NEURAL <span className="special-font text-cyber-text">HUB</span><br />
            <span className="cyber-gradient-text">TELEM</span>ETRY
          </h1>

          <p className="text-cyber-muted text-sm md:text-lg max-w-xl font-medium leading-relaxed mb-10">
            Next-generation neural monitoring for the Radiant network.
            Real-time synchronization across localized clusters and global intelligence nodes.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button className="zentry-button">
              Initialize Link
            </button>
            <button className="px-8 py-4 text-[10px] font-bold tracking-widest uppercase text-cyber-muted hover:text-cyber-text transition-colors border border-cyber-border rounded-full">
              View Whitepaper
            </button>
          </div>
        </motion.div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ rotateY: -5, rotateX: 2, scale: 1.02 }}
              className="bento-card p-8 group h-full flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-cyber-accent group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <ArrowUpRight className="w-4 h-4 text-cyber-text/20 group-hover:text-cyber-accent transition-colors" />
              </div>
              <div>
                <p className="text-cyber-muted text-[10px] font-bold uppercase tracking-widest mb-2">
                  {stat.label}
                </p>
                <p className={`text-4xl font-black font-zentry tracking-tight ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dimensional Feature Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Activity Log - Bento Span */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="md:col-span-8 bento-card p-8 md:p-12"
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black">TELEMETRY_STREAM</h2>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-1 h-8 rounded-full ${activity.type === 'error' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-cyber-accent shadow-[0_0_15px_rgba(237,255,102,0.4)]'}`} />
                    <div>
                      <span className="text-sm font-bold text-white block mb-0.5 uppercase tracking-wide">{activity.action}</span>
                      <span className="text-[9px] font-bold text-cyber-muted uppercase tracking-[0.2em]">{activity.type} // LOG_ID: {activity.id.toString().slice(-4)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyber-muted bg-white/5 px-3 py-1 rounded-full">{formatTimeAgo(activity.time)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Side Info Cards */}
          <div className="md:col-span-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bento-card p-8 bg-cyber-secondary shadow-[inset_0_0_80px_rgba(255,255,255,0.1)] h-[280px] flex flex-col justify-between"
            >
              <LayoutPanelLeft className="w-10 h-10 text-white/60" />
              <div>
                <h3 className="text-2xl font-black mb-2 text-white">INTERFACE_CONFIG</h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed">
                  Customize your neural workspace with dynamic widgets and holographic overlays.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bento-card p-1 bg-gradient-to-br from-cyber-accent/20 to-transparent"
            >
              <div className="bg-[#0A0A0A] rounded-[1.8rem] p-8 h-full border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-cyber-accent" />
                  <span className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest">Active Neural Link</span>
                </div>
                <p className="text-sm font-medium italic text-cyber-muted leading-relaxed">
                  "Core logic processing at 98.4% efficiency. Sub-system RX-7 reporting nominal values. Ready for transmission."
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="pt-24 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <img src="/logo.png" alt="Zentry Style" className="w-8 h-8" />
            <span className="font-zentry text-xl font-black tracking-tighter">CYBERBOY</span>
          </div>
          <p className="text-[10px] font-bold tracking-[0.5em] text-white/10 uppercase">
            Radiant Protocol v2.4.0 // All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


