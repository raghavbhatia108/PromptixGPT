import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import "./CommunityChat.css";

function CommunityChat() {
  const { selectedCommunityChat, setView } = useContext(MyContext);

  if (!selectedCommunityChat) {
    return <div className="community-chat-error">No chat selected</div>;
  }

  return (
    <div className="community-chat">
      <div className="community-chat-header">
        <div className="community-chat-header-left">
          <button className="back-button" onClick={() => setView('community')}>
            ← Back to Community
          </button>
        </div>
        <div className="community-chat-header-content">
          <h1>{selectedCommunityChat.title}</h1>
          <p>Shared on {new Date(selectedCommunityChat.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="community-chat-messages">
        <Chat messages={selectedCommunityChat.messages} loading={false} />
      </div>
    </div>
  );
}

export default CommunityChat;