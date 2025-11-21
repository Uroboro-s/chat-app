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

// Import modules
const { connectDB, config } = require("./config");
const routes = require("./routes");
const { setupSocketHandlers } = require("./socket");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/", routes);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: config.corsOrigins,
    credentials: true,
  },
});

// Initialize database connection
connectDB();

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Start server
server.listen(config.port, () => {
  console.log(`✓ Server running on port ${config.port}`);
  console.log(`✓ Socket.IO server ready`);
});

// Enable Socket.IO Admin UI (development only)
if (config.nodeEnv !== "production") {
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
