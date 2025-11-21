// Socket.IO event handlers
const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`✓ Client connected: ${socket.id}`);

    // Handle sending messages to a room
    socket.on("send", (message, room, activeUser) => {
      try {
        if (!message || message.trim() === "") {
          console.error("Empty message received");
          return;
        }

        if (!room || room.trim() === "") {
          // Broadcast to all clients if no room specified
          socket.broadcast.emit("receive", message, activeUser);
          console.log(`Broadcasting message from ${activeUser}`);
        } else {
          // Send to specific room
          socket.to(room).emit("receive", message, activeUser);
          console.log(`Message sent to room '${room}' by ${activeUser}`);
        }
      } catch (error) {
        console.error("Error handling send event:", error);
      }
    });

    // Handle joining a room
    socket.on("join-room", (room, callback) => {
      try {
        if (!room || room.trim() === "") {
          callback({ error: "Room ID is required" });
          return;
        }

        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);

        if (typeof callback === "function") {
          callback({ success: true, message: `Joined ${room}` });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        if (typeof callback === "function") {
          callback({ error: "Failed to join room" });
        }
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`✗ Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
};

module.exports = { setupSocketHandlers };
