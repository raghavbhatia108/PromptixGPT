import "./Sidebar.css";
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

function Sidebar({ isOpen }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChat,
    getAllThreads,
    // ✅ NEW (for community feature)
    setView,
  } = useContext(MyContext);

  const createNewChat = () => {
    setView("chat"); // 👈 important
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChat([]);
  };

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user =
      storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (err) {
    user = null;
    console.log(err);
  }
  const changeThread = async (newThreadId) => {
    setView("chat"); // 👈 switch back to chat view
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/threads/${newThreadId}`,
        { headers: { Authorization: localStorage.getItem("token") } },
      );
      const res = await response.json();

      setPrevChat(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDashboardClick = () => {
    setView("dashboard");
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/threads/${threadId}`,
        {
          method: "DELETE",
          headers: { Authorization: localStorage.getItem("token") },
        },
      );

      await response.json();

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [getAllThreads]);

  return (
    <section className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* 🔝 TOP */}
      <div className="top">
        <img
          src="/src/assets/logo_icon.png"
          alt=""
          width="200px"
          className="logo"
        />

        <button className="main_b" onClick={createNewChat}>
          <i className="fa-solid fa-pen-to-square"></i>
          <p>New Chat</p>
        </button>
      </div>

      {/* 📜 THREAD HISTORY */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            <span className="thread-title">{thread.title}</span>

            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* 👤 FOOTER */}
      <button className="sidebar-btn" onClick={handleDashboardClick}>
        <i className="fa-solid fa-user"></i>
        <p>{user?.name}'s Dashboard</p>
      </button>
    </section>
  );
}

export default Sidebar;
