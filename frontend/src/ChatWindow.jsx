import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChat,
    setNewChat,
    getAllThreads,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // const handleProfileClick =  () => {
  //   setIsOpen(!isOpen);
  // };

  // const shareChat = async () => {
  //   try {
  //     const url = `${import.meta.env.VITE_API_BASE_URL}/api/community/share/${currThreadId}`;
  //     console.log('Sharing thread ID', currThreadId, 'via', url);

  //     const response = await fetch(url, {
  //       method: 'POST',
  //     });

  //     let data = null;
  //     try {
  //       data = await response.json();
  //     } catch (jsonErr) {
  //       console.warn('Failed to parse JSON response from share:', jsonErr);
  //     }

  //     if (!response.ok) {
  //       const message = data?.error || data?.message || `${response.status} ${response.statusText}`;
  //       toast.error(`Failed to share chat: ${message}`);
  //       return;
  //     }

  //     toast.success(data?.message || 'Chat shared successfully');
  //   } catch (error) {
  //     console.error('Error sharing chat:', error);
  //     alert('Error sharing chat: network/error');
  //   }
  // };

  const getReply = async () => {
    if (!prompt.trim()) return;

    // 1. Capture the message and clear the input instantly
    const currentMessage = prompt;
    setPrompt("");

    setLoading(true);
    setNewChat(false);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            message: currentMessage,
            threadId: currThreadId,
          }),
        },
      );

      const res = await response.json();
      console.log(res);

      // 2. Append BOTH messages at the exact same time
      // This restores your original flow and stops the typing glitch
      setPrevChat((prevChat) => [
        ...prevChat,
        { role: "user", content: currentMessage },
        { role: "Assistant", content: res.reply },
      ]);

      setReply(res.reply);
      await getAllThreads();
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch response.");
    }

    setLoading(false);
  };
  return (
    <div className="chatWindow">
      {isOpen && (
        <div className="dropdown">
          <div className="dropdownItem">Upgrade Plan</div>
          <div className="dropdownItem">Settings</div>
          <div className="dropdownItem">Log Out</div>
        </div>
      )}
      <Chat loading={loading} />
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything!"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          PromptixGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
