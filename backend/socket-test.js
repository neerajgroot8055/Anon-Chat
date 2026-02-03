const { io } = require("socket.io-client");

const socket = io("http://localhost:3000"); // only if backend runs on 3000

socket.on("connect", () => {
  console.log("✅ Connected with id:", socket.id);

  socket.emit("join_queue", {
  token: "PASTE_JWT_HERE",
});

});

socket.on("match_found", ({ roomId, commonInterests }) => {
  console.log("🎯 Matched in room:", roomId);
  console.log("Common interests:", commonInterests);

  setTimeout(() => {
    socket.emit("send_message", {
      roomId,
      message: "Hello from " + socket.id,
    });
  }, 2000);
});

socket.on("receive_message", (data) => {
  console.log("📩 Message:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});
