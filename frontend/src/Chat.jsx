import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { PropagateLoader } from "react-spinners";

function Chat({ loading, messages }) {
  const { newChat, prevChat, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null); // 1. Added a new ref for the bottom
  const chatList = messages ?? prevChat;

  useEffect(() => {
    // typing animation only for current thread messages
    if (!messages) {
      if (reply === null) {
        setLatestReply(null);
        setIsTyping(false);
        return;
      }
      if (!prevChat?.length) return;

      setIsTyping(true);
      setLatestReply(""); // Start with empty to prevent flash
      const content = reply.split(" ");
      let idx = 0;
      const interval = setInterval(() => {
        setLatestReply(content.slice(0, idx + 1).join(" "));
        idx++;
        if (idx >= content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 50);

      return () => {
        clearInterval(interval);
        setIsTyping(false);
      };
    }
  }, [messages, prevChat, reply]);

  // 2. Updated Auto-scroll logic to include 'loading' and use the bottom ref
  useEffect(() => {
    if (!messages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevChat, reply, latestReply, messages, loading]);

  const hasChats = Array.isArray(chatList) && chatList.length > 0;

  return (
    <>
      <div className="chats" ref={chatRef}>
        {!messages && newChat && (
          <div className="empty-state">
            <h1>Welcome to PromptixGPT!</h1>
            <p>Start a new Chat!</p>

            <div className="feature-cards">
              <div className="card">
                <h3>💬 Ask Anything</h3>
                <p>Generate code, ideas, answers instantly</p>
              </div>

              <div className="card">
                <h3>🌍 Explore Community</h3>
                <p>See what others are building</p>
              </div>

              <div className="card">
                <h3>🤝 Share & Collaborate</h3>
                <p>Share your chats and learn together</p>
              </div>
            </div>
          </div>
        )}

        {hasChats && (
          <div id="chat-export">
            {chatList
              .slice(0, messages ? chatList.length : -1)
              .map((chat, idx) => (
                <div
                  className={
                    chat.role === "user"
                      ? "messageRowUser"
                      : "messageRowAssistant"
                  }
                  key={idx}
                >
                  {chat.role === "user" ? (
                    <div className="messageBubbleUser">
                      <p className="userMessage">{chat.content}</p>
                    </div>
                  ) : (
                    <div className="messageBubbleAssistant">
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {chat.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}

            {!messages && (
              <>
                {isTyping ? (
                  <div className="messageRowAssistant">
                    <div className="messageBubbleAssistant">
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {latestReply}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="messageRowAssistant">
                    <div className="messageBubbleAssistant">
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {prevChat[prevChat.length - 1].content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {loading && (
          <div className="loader-container">
            <PropagateLoader color="#fff" />
          </div>
        )}

        {/* 3. The invisible div that acts as the anchor for scrolling */}
        <div
          ref={messagesEndRef}
          style={{ float: "left", clear: "both", paddingBottom: "20px" }}
        />
      </div>
    </>
  );
}

export default Chat;
