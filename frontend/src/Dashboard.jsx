import { useEffect, useState } from "react";
import "./Dashboard.css";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const chartData = [
    { name: "Total Chats", value: stats?.totalChats || 0 },
    { name: "Total Messages", value: stats?.totalMessages || 0 },
  ];
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/stats`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);
  if (!stats) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="card">
            <h2>{stats.totalChats}</h2>
            <p>Total Chats</p>
          </div>

          <div className="card">
            <h2>{stats.totalMessages}</h2>
            <p>Total Messages</p>
          </div>

          <div className="card">
            <h2>
              {new Date(stats.lastActive).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <p>Last Active</p>
          </div>
        </div>
        {/* <div className="chart-container">
          <h3>Usage Overview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 13 }}
              />

              <Tooltip
                contentStyle={{
                  background: "#111318",
                  border: "1px solid #2d3240",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                cursor={false}
              />

              <Bar
                dataKey="value"
                fill="url(#gradient)"
                radius={[10, 10, 0, 0]}
                barSize={100}
              />

              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3bc4f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#3333ea" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div> */}
        <div className="dashboard-row">
          {/* LEFT */}

          {/* RIGHT */}
          <div className="insight-container">
            <h3>Insights</h3>

            <div className="insight-card">
              <p>Avg Messages / Chat</p>
              <h2>
                {stats.totalChats > 0
                  ? (stats.totalMessages / stats.totalChats).toFixed(1)
                  : 0}
              </h2>
            </div>

            <div className="insight-card">
              <p>Activity Level</p>
              <h2>
                {stats.totalMessages > 20
                  ? "Active"
                  : stats.totalMessages > 5
                    ? "Moderate"
                    : "Inactive"}
              </h2>
            </div>

            <div className="insight-card">
              <p>Status</p>
              <h2>Active User ✅</h2>
            </div>
          </div>
          <div className="chart-container">
            <h3>Usage Overview</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 13 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#111318",
                    border: "1px solid #2d3240",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  cursor={false}
                />

                <Bar
                  dataKey="value"
                  fill="url(#gradient)"
                  radius={[10, 10, 0, 0]}
                  barSize={100}
                />

                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3bc4f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3333ea" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
