import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Community from "./Community.jsx";
import CommunityChat from "./CommunityChat.jsx";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { Toaster } from "react-hot-toast";
import Auth from "./auth.jsx";
import About from "./About.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChat, setPrevChat] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sharedThreads, setSharedThreads] = useState([]); // list of shared thread IDs
  const [view, setView] = useState("chat");
  const [selectedCommunityChat, setSelectedCommunityChat] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getAllThreads = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/threads`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      const res = await response.json();

      if (!response.ok) {
        console.error("Auth error:", res);
        return;
      }

      if (!Array.isArray(res)) {
        console.error("Not array:", res);
        return;
      }

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    }
  }, [token]);

  useEffect(() => {
    const fetchSharedThreads = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/community`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setSharedThreads(data.map((item) => item.threadId));
        }
      } catch (err) {
        console.error("Failed to fetch shared threads", err);
      }
    };
    fetchSharedThreads();
  }, []);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChat,
    setPrevChat,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    sharedThreads,
    setSharedThreads,
    view,
    setView,
    selectedCommunityChat,
    setSelectedCommunityChat,
    getAllThreads,
  };
  return (
    <div className="app">
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <MyContext.Provider value={providerValues}>
          <Sidebar
            setToken={setToken}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          {sidebarOpen && (
            <div
              className="mobile-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className="main-content">
            <Navbar
              setToken={setToken}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <div className="view-content">
              {view === "chat" && <ChatWindow />}
              {view === "community" && <Community />}
              {view === "communityChat" && <CommunityChat />}
              {view === "about" && <About />}
              {view === "dashboard" && <Dashboard />}
            </div>
          </div>
        </MyContext.Provider>
      )}
      <Toaster
        containerStyle={{
          position: "absolute",
          top: "20px",
          left: "55%",
          transform: "translateX(-50%)",
          width: "auto",
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2128",
            textAlign: "center",
            color: "#e5e7eb",
            border: "1px solid #2d3240",
            borderRadius: "8px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#1f2128",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1f2128",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
