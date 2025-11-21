// Node server to handle HTTP requests and Socket.IO connections
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { instrument } = require("@socket.io/admin-ui");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Import routes
const indexRouter = require("./routes");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/", indexRouter);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    credentials: true,
  },
});

// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB successfully");
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Socket.IO event handlers
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

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Socket.IO server ready`);
});

// Enable Socket.IO Admin UI (development only)
if (process.env.NODE_ENV !== "production") {
  instrument(io, { auth: false, mode: "development" });
  console.log("✓ Socket.IO Admin UI enabled at https://admin.socket.io");
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

// const messagehj = Message.find({ roomid: "hj" })
//   .exec()
//   .then((obj) => {
//     new Room({
//       roomid: "hj",
//       messages: obj,
//     })
//       .save()
//       .then(() => console.log("hj successful"));
//   });
// const messagevj = Message.find({ roomid: "vj" })
//   .exec()
//   .then((obj) => {
//     new Room({
//       roomid: "vj",
//       messages: obj,
//     })
//       .save()
//       .then(() => console.log("vj successful"));
//   });

// const messageList = [
//   new Message({ sender: userHarsh, message: "hello", roomid: "hj" }),
//   new Message({ sender: userJai, message: "hiii", roomid: "hj" }),
//   new Message({ sender: userHarsh, message: "kya kr rhe ho", roomid: "hj" }),
//   new Message({ sender: userJai, message: "coding", roomid: "hj" }),
//   new Message({
//     sender: userHarsh,
//     message: "accha. mai ai padh raha",
//     roomid: "hj",
//   }),
//   new Message({
//     sender: userJai,
//     message: "hmm aao courtpiece khele",
//     roomid: "hj",
//   }),
//   new Message({ sender: userHarsh, message: "chalo", roomid: "hj" }),

//   new Message({
//     sender: userViral,
//     message: ":)",
//     roomid: "vj",
//   }),
//   new Message({ sender: userJai, message: "yo ho ho ho", roomid: "vj" }),
// ];

// messageList.forEach((message) => {
//   message
//     .save()
//     .then(() => console.log("success"))
//     .catch((err) => console.log("failed"));
//   setTimeout(() => console.log("time elapsed"), 2000);
// });
