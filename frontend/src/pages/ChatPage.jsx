import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RoomList, MessageWindow } from "../components/chat";
import { fetchRoomList, socket } from "../services";

function ChatPage() {
  const { userid } = useParams();
  const [activeRoom, setActiveRoom] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userid) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const rooms = await fetchRoomList(userid);
        setRoomList(rooms || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms");
        setRoomList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid]);

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="app">
      <div className="title">
        Messenger
        {userid && (
          <span style={{
            fontSize: "0.9rem",
            fontWeight: "400",
            marginLeft: "1rem",
            color: "var(--text-secondary)"
          }}>
            @{userid}
          </span>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ margin: "1rem" }}>
          {error}
        </div>
      )}

      <div className="screen">
        {loading ? (
          <div style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            width: "100%",
            marginTop: "2rem"
          }}>
            Loading rooms...
          </div>
        ) : (
          <>
            <RoomList
              list={roomList}
              setRoom={setActiveRoom}
              currentRoom={activeRoom}
            />
            <MessageWindow
              socket={socket}
              roomID={activeRoom}
              activeUser={userid}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
