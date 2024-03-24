const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "HEAD", "POST"],
    credentials: true,
  },
});

const port = 3000;

io.on("connection", (socket) => {
  console.log("Connected");
  console.log("ID", socket.id);

  socket.on("sendMessageToId", ({ roomId, targetId, message }) => {
    console.log(
      `Message from ${socket.id} in room ${roomId} to ${targetId}: ${message}`
    );
    io.to(roomId).to(targetId).emit("receive-message", message);
  });

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room: ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
