import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import "./Community.css";

function Community() {
  const { setView, setSelectedCommunityChat } = useContext(MyContext);
  const [sharedChats, setSharedChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedChats();
  }, []);

  const fetchSharedChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/community`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setSharedChats(data);
      }
    } catch (error) {
      console.error("Error fetching shared chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    setSelectedCommunityChat(chat);
    setView("communityChat");
  };

  if (loading) {
    return <div className="community-loading">Loading community chats...</div>;
  }

  return (
    <div className="community">
      <div className="community-header">
        <h1>Community Hub</h1>
        <p>Explore shared conversations from the community</p>
      </div>
      <div className="community-grid">
        {sharedChats.map((chat) => (
          <div
            key={chat._id}
            className="community-card"
            onClick={() => handleChatClick(chat)}
          >
            <h3>{chat.title}</h3>
            <p>{chat.messages.length} messages</p>
            <small>
              Shared on {new Date(chat.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))}
        {sharedChats.length === 0 && (
          <div className="no-chats">
            <p>No shared chats yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;
