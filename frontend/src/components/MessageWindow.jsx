/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { addMessage, fetchMessages } from "./apiFunctions";

function MessageWindow({ socket, roomID, activeUser }) {
  const [value, setValue] = useState("");
  const [activeMessages, setActiveMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  // Handle message submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!value.trim()) return;

    if (!roomID) {
      setError("Please select a room first");
      return;
    }

    try {
      // Emit socket event for real-time delivery
      socket.emit("send", value, roomID, activeUser);

      // Save to database
      await addMessage(value, activeUser, roomID);

      // Add to local state immediately for better UX
      setActiveMessages((prev) => [
        ...prev,
        { message: value, sender: activeUser, roomid: roomID },
      ]);

      setValue("");
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  // Fetch messages when room changes
  useEffect(() => {
    if (!roomID) {
      setActiveMessages([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Join the socket room
        socket.emit("join-room", roomID, (response) => {
          console.log("Joined room:", response);
        });

        // Fetch message history
        const messages = await fetchMessages(roomID);
        setActiveMessages(messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        setActiveMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomID, socket]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceive = (message, sender) => {
      // Don't add message if it's from the current user (already added in handleSubmit)
      if (sender !== activeUser) {
        setActiveMessages((prev) => [
          ...prev,
          { sender, message, roomid: roomID },
        ]);
      }
    };

    socket.on("receive", handleReceive);

    // Cleanup listener on unmount
    return () => {
      socket.off("receive", handleReceive);
    };
  }, [socket, activeUser, roomID]);

  // Determine if message is from current user
  const isOwnMessage = (msg) => {
    return (
      activeUser === msg.sender ||
      activeUser === msg.sender?.userid
    );
  };

  return (
    <div className="container">
      <ul className="window">
        {loading && (
          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            Loading messages...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !roomID && (
          <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "2rem" }}>
            Select a room to start chatting
          </div>
        )}

        {!loading && roomID && activeMessages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "2rem" }}>
            No messages yet. Start the conversation!
          </div>
        )}

        {activeMessages.map((msg, index) => (
          <div
            className={isOwnMessage(msg) ? "right-align" : "left-align"}
            key={`${msg._id || index}-${msg.message}-${Date.now()}`}
          >
            {msg.message}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </ul>

      <div className="control">
        <form action="#" id="send-form" onSubmit={handleSubmit}>
          <div className="message-input-container">
            <input
              name="message"
              type="text"
              placeholder="Type your message..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!roomID}
              maxLength={500}
            />
          </div>
          <div className="send-button">
            <button type="submit" disabled={!roomID || !value.trim()}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageWindow;
