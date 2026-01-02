import { useState, useEffect } from "react";
import { getChatbotData, formatTimeAgo } from "../utils/chatbotData";

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
    { label: "Total Queries_Log", value: chatbotData.totalQueries.toLocaleString(), color: "text-cyber-accent" },
    { label: "Neural_Messages", value: chatbotData.totalMessages.toLocaleString(), color: "text-cyber-text" },
    { label: "Operator_Input", value: chatbotData.totalUserMessages.toLocaleString(), color: "text-cyber-text" },
    { label: "Success_Coefficient", value: `${successRate}%`, color: "text-cyber-success" },
  ];

  const recentActivity = chatbotData.recentActivity.slice(0, 8);

  return (
    <div className="min-h-screen bg-cyber-bg p-8 lg:p-12 relative overflow-hidden text-cyber-text">
      <div className="scanline" />

      {/* Header Area */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px w-12 bg-cyber-accent" />
          <span className="text-[10px] font-orbitron font-black tracking-[0.5em] text-cyber-accent uppercase">Intelligence_Analysis</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-black text-cyber-text font-orbitron tracking-tighter">
          SYSTEM_STATISTICS<span className="text-cyber-accent">.</span>
        </h1>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cyber-border border border-cyber-border mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="bg-cyber-bg p-8 group hover:bg-black transition-all duration-500 cursor-default">
            <p className="text-cyber-muted group-hover:text-white/70 text-[10px] font-orbitron uppercase tracking-widest mb-6 transition-colors">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold font-cyber tracking-tighter transition-colors group-hover:text-white ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Activity Log */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-orbitron font-black tracking-widest uppercase">Telemetry_Stream</h2>
            <div className="text-[9px] font-mono text-cyber-muted">[ RECORDS: {recentActivity.length} ]</div>
          </div>

          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="group flex items-center justify-between p-5 border border-cyber-border hover:border-cyber-accent/30 bg-white/[0.01] transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className={`w-1 h-6 ${activity.type === 'error' ? 'bg-red-500' : 'bg-cyber-accent/40 group-hover:bg-cyber-accent transition-colors'}`} />
                    <div>
                      <span className="text-xs font-cyber block mb-1">{activity.action}</span>
                      <span className="text-[8px] font-mono text-cyber-muted uppercase tracking-widest">Type: {activity.type}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-cyber-muted pr-4">{formatTimeAgo(activity.time)}</span>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-cyber-border">
                <p className="text-[10px] uppercase font-orbitron tracking-widest text-cyber-muted">No_Telemetry_Available</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Protocols */}
        <div className="space-y-8">
          <div className="p-8 border border-cyber-border bg-white/[0.01]">
            <h3 className="text-xs font-orbitron font-black tracking-widest uppercase mb-8 border-b border-cyber-border pb-4">Exec_Protocols</h3>
            <div className="space-y-4">
              <a href="/" className="cyber-button w-full border-cyber-muted text-cyber-muted hover:border-cyber-accent hover:text-cyber-accent">Initialize_Interface</a>
              <button className="cyber-button w-full border-cyber-muted text-cyber-muted hover:border-cyber-accent hover:text-cyber-accent">Refresh_Neural_Buffer</button>
              <button className="w-full text-center text-[10px] font-orbitron tracking-widest text-cyber-muted hover:text-white transition-colors uppercase pt-4">Emergency_Shutdown</button>
            </div>
          </div>

          <div className="p-8 border border-cyber-border bg-cyber-accent/5">
            <h3 className="text-xs font-orbitron font-black tracking-widest uppercase mb-4 text-cyber-accent">Core_Logic_Node</h3>
            <p className="text-[10px] leading-relaxed text-cyber-muted font-mono mb-6">
              Neural weights synchronized.
              Local buffer verified.
              Node Node_AP_SO_1 online.
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-cyber-success animate-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
