// Configuration index
const connectDB = require("./database");

// Environment configuration
const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: ["http://localhost:5173", "https://admin.socket.io"],
};

module.exports = {
  connectDB,
  config,
};
