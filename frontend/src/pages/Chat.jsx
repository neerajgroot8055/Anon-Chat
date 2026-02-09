import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const isGuest = localStorage.getItem("isGuest") === "true";
  const guestInterests = JSON.parse(
    localStorage.getItem("guestInterests") || "[]"
  );

  const displayMode = isGuest ? "Guest mode" : "Logged in";

  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    
    if (!token && !isGuest) return;

    const s = connectSocket(isGuest ? null : token);
    setSocket(s);

    s.on("connect", () => {
      setStatus("Searching for match...");

      if (isGuest) {
        s.emit("join_queue", {
          isGuest: true,
          interests: guestInterests,
        });
      } else {
        s.emit("join_queue", { token });
      }
    });

    s.on("match_found", ({ roomId, commonInterests }) => {
      setRoomId(roomId);
      setStatus(
        commonInterests.length
          ? `Matched! Common: ${commonInterests.join(", ")}`
          : "Matched!"
      );
    });

    s.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    s.on("partner_left", () => {
      setStatus("Partner left the chat");
      setRoomId(null);
      setMessages([]);
    });

    s.on("disconnect", () => {
      setStatus("Disconnected");
    });

    return () => {
      s.emit("skip");
      s.disconnect();

      setMessages([]);
      setRoomId(null);
      setStatus("Disconnected");
    };
  }, [token, isGuest]);

  const sendMessage = () => {
    if (!message.trim() || !roomId || !socket) return;

    socket.emit("send_message", {
      roomId,
      message,
    });

    setMessage("");
  };

  const skipMatch = () => {
    if (!socket) return;

    socket.emit("skip");

    setMessages([]);
    setRoomId(null);
    setStatus("Searching for new match...");

    if (isGuest) {
      socket.emit("join_queue", {
        isGuest: true,
        interests: guestInterests,
      });
    } else {
      socket.emit("join_queue", { token });
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.emit("skip");
      socket.disconnect();
    }

    
    localStorage.removeItem("isGuest");
    localStorage.removeItem("guestInterests");
    localStorage.removeItem("userInterests");

    logout();
    navigate("/signup");
  };

  const goBack = () => {
    if (!socket) return;

    socket.emit("skip");
    setMessages([]);
    setRoomId(null);
    navigate("/interests");
  };

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
    
  
    
      <div className="flex items-center justify-between px-6 py-4 border-b">
  <div>
    <h2 className="text-lg font-semibold text-gray-800">
      Anon Chat
    </h2>
    <p className="text-sm text-gray-500">
      {isGuest ? "Guest mode" : "Logged in"}
    </p>
  </div>

  <div className="flex gap-2">
    <button
      onClick={goBack}
      className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
    >
      ← Back
    </button>

    <button
      onClick={handleLogout}
      className="px-3 py-1 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100"
    >
      {isGuest ? "Exit" : "Logout"}
    </button>
  </div>
</div>


      <div className="px-6 py-2 text-sm text-gray-600 border-b">
  Status: <span className="font-medium">{status}</span>
</div>


        <div className="px-6 py-4 h-[360px] overflow-y-auto space-y-2 bg-gray-50">
  {messages.length === 0 && (
    <p className="text-sm text-gray-400 italic">
      No messages yet
    </p>
  )}

  {messages.map((msg, idx) => (
    <div
      key={idx}
      className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
        msg.sender === "You"
          ? "ml-auto bg-blue-600 text-white"
          : "bg-white border text-gray-800"
      }`}
    >
      <div className="text-xs font-medium mb-1 opacity-70">
        {msg.sender}
      </div>
      {msg.message}
    </div>
  ))}
</div>


        <div className="px-6 py-4 border-t flex gap-2">
  <input
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    disabled={!roomId}
    placeholder={
      roomId ? "Type your message…" : "Waiting for a match…"
    }
    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
  />

  <button
    onClick={sendMessage}
    disabled={!roomId}
    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300"
  >
    Send
  </button>
</div>


        <br /><br />
<div className="px-6 pb-4">
  <button
    onClick={skipMatch}
    className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
  >
    Skip match
  </button>
</div>

      </div>
</div>
    </>
  );
};

export default Chat;
