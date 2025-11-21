const express = require("express");
const router = express.Router();
const { User, Message } = require("../models");

// Health check endpoint
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Chat API is running",
    timestamp: new Date().toISOString(),
  });
});

// Fetch all rooms for a user
router.get("/fetchRooms/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    // Validation
    if (!userid || userid.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // Find user and populate rooms
    const user = await User.findOne({ userid: userid.trim() })
      .populate("rooms")
      .exec();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.json({
      status: "success",
      rooms: user.rooms || [],
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
});

// Fetch all messages in a room
router.get("/fetchMessages/:roomid", async (req, res) => {
  try {
    const { roomid } = req.params;

    // Validation
    if (!roomid || roomid.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Room ID is required",
      });
    }

    // Fetch messages and populate sender details
    const messages = await Message.find({ roomid: roomid.trim() })
      .populate("sender", "userid") // Only populate userid field
      .sort({ date_created: 1 }) // Sort by date ascending
      .exec();

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.json({
      status: "success",
      messages: messages || [],
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// Send a new message
router.post("/sendMessage/:roomid/:sender", async (req, res) => {
  try {
    const { roomid, sender: senderid } = req.params;
    const { message } = req.body;

    // Validation
    if (!roomid || roomid.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Room ID is required",
      });
    }

    if (!senderid || senderid.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Sender ID is required",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Message content is required",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        status: "error",
        message: "Message must be less than 500 characters",
      });
    }

    // Find sender
    const sender = await User.findOne({ userid: senderid.trim() }).exec();

    if (!sender) {
      return res.status(404).json({
        status: "error",
        message: "Sender not found",
      });
    }

    // Create and save message
    const messageObj = new Message({
      message: message.trim(),
      sender: sender._id,
      roomid: roomid.trim(),
    });

    await messageObj.save();

    // Populate sender details before sending response
    await messageObj.populate("sender", "userid");

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(201).json({
      status: "success",
      message: messageObj,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send message",
      error: error.message,
    });
  }
});

module.exports = router;
