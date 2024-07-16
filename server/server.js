const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const process = require("process");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
  // socket.on("join-room", (roomId, userId) => {
  //   socket.join(roomId);
  //   socket.emit("user-connected", userId);
  // });
});

server.listen(process.env.PORT || 8000, () =>
  console.log("server is running on port 8000")
);
