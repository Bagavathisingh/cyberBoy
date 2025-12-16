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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 text-center sm:text-left">
          Dashboard
        </h1>
        <p className="text-purple-300 text-center sm:text-left">
          Welcome to your Cyber Boy control center
        </p>
        {chatbotData.lastUpdated && (
          <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">
            Last updated: {formatTimeAgo(chatbotData.lastUpdated)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200"
          >
            <p className="text-gray-400 text-xs sm:text-sm mb-2">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {stat.value}
            </p>
            {stat.change && (
              <p className={`text-xs sm:text-sm font-semibold ${stat.color}`}>
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-500/30">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-400"
                          : activity.type === "error"
                          ? "bg-red-400"
                          : activity.type === "warning"
                          ? "bg-yellow-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <span className="text-gray-200 text-xs sm:text-sm">
                      {activity.action}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No activity yet. Start chatting to see statistics!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-500/30">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <a
              href="/"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-center block text-sm sm:text-base"
            >
              Start New Chat
            </a>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base">
              View Reports
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base">
              System Settings
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base">
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-purple-500/30">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-200 text-sm">API Status: Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-200 text-sm">Database: Connected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-200 text-sm">Security: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
