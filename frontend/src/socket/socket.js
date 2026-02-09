import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io("https://anon-chat-i4ph.onrender.com", {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;
