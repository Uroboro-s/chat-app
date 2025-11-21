const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userid: { type: String, required: true },
  password: { type: String, required: true },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
});

module.exports = mongoose.model("User", UserSchema);
