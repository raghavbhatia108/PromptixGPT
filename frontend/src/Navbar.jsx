import "./Navbar.css";
import { useContext, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import toast from "react-hot-toast";
import { exportStyledPDF } from "./utils/ExportPDF.js";

function Navbar({ setToken, sidebarOpen, setSidebarOpen }) {
  const {
    view,
    setView,
    currThreadId,
    prevChat,
    sharedThreads,
    setSharedThreads,
  } = useContext(MyContext);

  const isThreadShared = currThreadId && sharedThreads.includes(currThreadId);
  const [openProfile, setOpenProfile] = useState(false);

  const handleCommunityClick = () => {
    setView("community");
  };
  const handleAboutClick = () => {
    setView("about");
  };
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  const handleShare = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/community/share/${currThreadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        console.warn("Share response is not JSON", error);
      }

      if (!response.ok) {
        toast.error(
          `Unable to share: ${data?.error || data?.message || response.statusText}`,
        );
        return;
      }

      if (currThreadId && !isThreadShared) {
        setSharedThreads((prev) => [...new Set([...prev, currThreadId])]);
      }

      toast.success(data?.message || "Shared successfully");
    } catch (error) {
      console.error("Share failed", error);
      alert("Network issue sharing chat");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <img
          src="/src/assets/logo_text.png"
          alt="PromptixGPT"
          className="navbar-logo"
        />
      </div>

      <div className="navbar-buttons">
        {view === "chat" && !!currThreadId && (
          <button
            className="navbar-btn"
            onClick={handleShare}
            disabled={isThreadShared || !prevChat?.length}
            title={
              isThreadShared ? "Thread already shared" : "Share this thread"
            }
          >
            <i className="fa-solid fa-share"></i>
            <span className="btn-text">
              {isThreadShared ? "Published" : "Publish"}
            </span>
          </button>
        )}
        {view === "chat" && !!prevChat?.length && (
          <button
            className="navbar-btn"
            onClick={() => exportStyledPDF(prevChat)}
          >
            <i className="fa-solid fa-file-pdf"></i>
            <span className="btn-text"> Export PDF</span>
          </button>
        )}
        <button className="navbar-btn" onClick={handleCommunityClick}>
          <i className="fa-solid fa-globe"></i>
          <span className="btn-text"> Community</span>
        </button>

        <button className="navbar-btn" onClick={handleAboutClick}>
          <i class="fa-solid fa-circle-info"></i>
          <span className="btn-text">About</span>
        </button>

        <div className="profile-wrapper">
          <div
            className="profile-icon"
            onClick={() => setOpenProfile(!openProfile)}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          {openProfile && (
            <div className="profile-dropdown">
              <div className="user-info">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
              <div className="divider"></div>

              <p className="logout" onClick={handleLogout}>
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
