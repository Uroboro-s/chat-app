/* eslint-disable react/prop-types */
import { useState } from "react";

function List({ list, setRoom, currentRoom }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleRoomClick = (roomid, index) => {
    setRoom(roomid);
    setActiveIndex(index);
  };

  return (
    <div>
      <div style={{
        padding: "1rem 0",
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "var(--text-primary)",
        textAlign: "center",
        borderBottom: "1px solid var(--border-color)",
        marginBottom: "1rem"
      }}>
        Rooms
      </div>

      <ul className="list">
        {list.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            padding: "2rem 1rem"
          }}>
            No rooms available
          </div>
        ) : (
          list.map((room, index) => (
            <li
              key={room._id || room.roomid}
              onClick={() => handleRoomClick(room.roomid, index)}
              style={{
                opacity: currentRoom === room.roomid ? 1 : 0.85,
                border: currentRoom === room.roomid ? "2px solid rgba(255, 255, 255, 0.3)" : "none"
              }}
            >
              {room.roomid}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default List;
