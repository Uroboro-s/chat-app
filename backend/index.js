//node server to handle socket io connections
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

// const io = new Server(server);

const { instrument } = require("@socket.io/admin-ui");
const Message = require("./message.model");
const Room = require("./room.model");
const indexRouter = require("./routes");

// console.log(instrument);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRouter);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    credentials: true,
  },
});

main()
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

const userHarsh = "663d023ebde8c7ffa8c60897";
const userJai = "663d023ebde8c7ffa8c60898";
const userViral = "663d023ebde8c7ffa8c60899";

// const users = {};

io.on("connection", (socket) => {
  console.log(socket.id);
  //   socket.on("new-user-joined", (name) => {
  //     users[socket.id] = name;
  //     socket.broadcast.emit("user-joined", name);
  //   });

  socket.on("send", (message, room, activeUser) => {
    // console.log("here");
    // socket.broadcast.emit("recieve", {
    //   message: message,
    //   name: users[socket.id],
    // });
    // io.emit("receive", message); //this emits to all clients
    // socket.broadcast.emit("receive", message);
    if (room === "") {
      socket.broadcast.emit("receive", message);
    } else {
      console.log(`Sending '${message} to room ${room}'`);
      socket.to(room).emit("receive", message, activeUser);
    } // for emitting ot a single client
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });
});

server.listen(3000, () => {
  console.log("server running at port 3000");
});
instrument(io, { auth: false, mode: "development" });

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
