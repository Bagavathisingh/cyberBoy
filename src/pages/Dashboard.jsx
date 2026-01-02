import { useState, useEffect } from "react";
import { getChatbotData, formatTimeAgo } from "../utils/chatbotData";

function Dashboard() {
  const [chatbotData, setChatbotData] = useState(getChatbotData());

  useEffect(() => {
    // Update data every second to show real-time stats
    const interval = setInterval(() => {
      setChatbotData(getChatbotData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate success rate
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
    {
      label: "Total Queries",
      value: chatbotData.totalQueries.toLocaleString(),
      change: "",
      color: "text-blue-400",
    },
    {
      label: "Total Messages",
      value: chatbotData.totalMessages.toLocaleString(),
      change: "",
      color: "text-green-400",
    },
    {
      label: "User Messages",
      value: chatbotData.totalUserMessages.toLocaleString(),
      change: "",
      color: "text-purple-400",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      change: "",
      color: "text-yellow-400",
    },
  ];

  const recentActivity = chatbotData.recentActivity
    .slice(0, 10)
    .map((activity) => ({
      ...activity,
      time: formatTimeAgo(activity.time),
    }));

  return (
    <div className="min-h-screen bg-cyber-bg cyber-grid-bg p-4 sm:p-6 md:p-8 relative">
      <div className="scanline" />

      <div className="mb-10 relative z-10">
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 text-center sm:text-left font-orbitron tracking-tighter cyber-text-glow">
          DATA_ANALYSIS
        </h1>
        <div className="h-1 w-32 bg-cyber-accent mb-4" />
        <p className="text-cyber-muted text-center sm:text-left font-mono text-sm tracking-widest">
          SYSTEM_CONTROL_CENTER // NODE_77
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 relative z-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="cyber-box p-6 group hover:border-cyber-accent transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-cyber-muted text-[10px] font-orbitron uppercase tracking-widest">
                {stat.label}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse" />
            </div>
            <p className={`text-3xl font-bold font-cyber ${stat.color} group-hover:cyber-text-glow`}>
              {stat.value}
            </p>
            <div className="mt-2 text-[9px] font-mono text-cyber-muted opacity-50 group-hover:opacity-100 transition-opacity">
              STATUS: NOMINAL
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 cyber-box p-6">
          <h2 className="text-xl font-bold text-cyber-accent mb-6 font-orbitron flex items-center justify-between">
            <span>RECENT_EVENT_LOG</span>
            <span className="text-[10px] text-cyber-muted font-mono">COUNT: {recentActivity.length}</span>
          </h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-cyber-border/30 bg-cyber-bg/40 hover:bg-cyber-accent/5 hover:border-cyber-accent/30 transition-all duration-200 group"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
                >
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <div
                      className={`w-1 h-8 ${activity.type === "success"
                          ? "bg-cyber-success"
                          : activity.type === "error"
                            ? "bg-cyber-secondary"
                            : "bg-cyber-accent"
                        }`}
                    />
                    <div>
                      <span className="text-cyber-text text-xs font-cyber block group-hover:text-cyber-accent transition-colors">
                        {activity.action}
                      </span>
                      <span className="text-cyber-muted text-[9px] font-mono uppercase tracking-[0.2em]">
                        TYPE: {activity.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-cyber-muted text-[10px] font-mono group-hover:text-cyber-accent/70 px-4">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-cyber-muted cyber-box bg-cyber-bg/20">
                <p className="font-mono text-sm">[NO_DATA_AVAILABLE]</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="cyber-box p-6 border-cyber-secondary/30">
            <h2 className="text-xl font-bold text-cyber-secondary mb-6 font-orbitron">
              DIRECT_ACCESS
            </h2>
            <div className="space-y-4">
              <a
                href="/"
                className="cyber-button w-full flex items-center justify-center text-xs"
              >
                BOOT_CHAT_INTERFACE
              </a>
              <button className="cyber-button w-full border-cyber-muted text-cyber-muted hover:border-cyber-text hover:text-cyber-text text-xs">
                VIEW_SYSTEM_REPORTS
              </button>
              <button className="cyber-button w-full border-cyber-muted text-cyber-muted hover:border-cyber-text hover:text-cyber-text text-xs">
                EXPORT_LOG_V3
              </button>
            </div>
          </div>

          <div className="cyber-box p-6 border-cyber-accent/20">
            <h2 className="text-xl font-bold text-white mb-6 font-orbitron">
              STATUS_REPORT
            </h2>
            <div className="space-y-4 font-mono text-[10px]">
              {[
                { label: 'API_NODE', status: 'ONLINE', color: 'text-cyber-success' },
                { label: 'DB_CLUSTER', status: 'ACTIVE', color: 'text-cyber-success' },
                { label: 'SEC_LEVEL', status: 'MAXIMUM', color: 'text-cyber-accent' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-cyber-border/50 pb-2">
                  <span className="text-cyber-muted">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={item.color}>{item.status}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
