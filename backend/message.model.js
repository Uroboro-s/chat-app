const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  roomid: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  date_created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
