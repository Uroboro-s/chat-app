const express = require("express");

const router = express.Router();

const User = require("./user.model");
const Message = require("./message.model");

router.get("/", (req, res) => res.send("server runnininngg!!"));

router.get("/fetchRooms/:userid", async (req, res) => {
  const userid = req.params.userid;
  const user = await User.findOne({ userid: userid }).populate("rooms").exec();

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.json({
    rooms: user.rooms,
  });
});

router.get("/fetchMessages/:roomid", async (req, res) => {
  const roomid = req.params.roomid;
  const messages = await Message.find({ roomid: roomid })
    .populate("sender")
    .exec();

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.json({
    messages,
  });
});

router.post("/sendMessage/:roomid/:sender", async (req, res) => {
  const roomid = req.params.roomid;
  const senderid = req.params.sender;
  const sender = await User.findOne({ userid: senderid }).exec();

  // console.log(message);

  const messageObj = new Message({
    message: req.body.message,
    sender: sender._id,
    roomid: roomid,
  });

  console.log(messageObj);
  await messageObj.save();

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  res.json({
    message: messageObj,
  });
});

module.exports = router;
