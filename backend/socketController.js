const io = require("./index");

io.on("connection", (socket) => {
  console.log("here");
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
      console.log(room);
      socket.to(room).emit("receive", message, activeUser);
    } // for emitting ot a single client
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });

  //   socket.on("receive", (message, name) => {
  //     console.log(message);
  //     console.log(name);
  //   });

  //   io.send("something");
});
