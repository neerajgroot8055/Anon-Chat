const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

let queue = [];

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
socket.on("join_queue", async ({ token, isGuest, interests }) => {
  try {
   
    if (isGuest) {
  
      if (!Array.isArray(interests) || interests.length === 0) {
        return;
      }

      socket.user = {
        id: socket.id,       
        username: "Guest",
        interests,
        isGuest: true,
      };

      console.log("📥 Guest joined with", interests);
    } else {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || !user.interests.length) {
        socket.disconnect();
        return;
      }

      socket.user = {
        id: user._id.toString(),
        username: user.username,
        interests: user.interests,
        isGuest: false,
      };

      console.log(
        `📥 ${socket.user.username} joined with`,
        socket.user.interests
      );
    }

   
    queue = queue.filter(
      (u) =>
        u.socket.id !== socket.id &&
        u.user.id !== socket.user.id
    );

  
    let matchIndex = queue.findIndex(
      (u) =>
        u.user.id !== socket.user.id &&
        u.interests.some((i) =>
          socket.user.interests.includes(i)
        )
    );

  
    if (matchIndex === -1 && queue.length > 0) {
      matchIndex = queue.findIndex(
        (u) => u.user.id !== socket.user.id
      );
    }

    if (matchIndex !== -1) {
      const match = queue[matchIndex];
      const roomId = uuidv4();

      socket.join(roomId);
      match.socket.join(roomId);

      socket.currentRoom = roomId;
      match.socket.currentRoom = roomId;

      const commonInterests = match.interests.filter((i) =>
        socket.user.interests.includes(i)
      );

      io.to(roomId).emit("match_found", {
        roomId,
        commonInterests,
      });

      queue.splice(matchIndex, 1);
    } else {
      queue.push({
        socket,
        user: socket.user,
        interests: socket.user.interests,
      });

      console.log("⏳ Waiting for match...");
    }
  } catch (err) {
    console.log("❌ join_queue error:", err.message);
    socket.disconnect();
  }
});


    socket.on("send_message", ({ roomId, message }) => {
      if (!socket.currentRoom || socket.currentRoom !== roomId) return;

      io.to(roomId).emit("receive_message", {
        sender: socket.user.username,
        message,
      });
    });

    
    socket.on("skip", () => {
      const roomId = socket.currentRoom;

      if (roomId) {
        socket.to(roomId).emit("partner_left");
        socket.leave(roomId);
        socket.currentRoom = null;
      }

      queue = queue.filter(
        (u) =>
          u.socket.id !== socket.id &&
          u.user.id !== socket.user?.id
      );

      console.log(`⏭️ ${socket.id} skipped`);
    });

   
    socket.on("disconnect", () => {
      const roomId = socket.currentRoom;

      if (roomId) {
        socket.to(roomId).emit("partner_left");
      }

      queue = queue.filter(
        (u) =>
          u.socket.id !== socket.id &&
          u.user.id !== socket.user?.id
      );

      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };
