import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export const sendNotification = (userId, message) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }
  io.to(userId).emit("notification", message);
};

export const broadcastNotification = (message) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }
  io.emit("notification", message);
};
