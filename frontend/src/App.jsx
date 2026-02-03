import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Interests from "./pages/Interests";
import Chat from "./pages/Chat";

const InterestsRoute = ({ children }) => {
  const { token } = useAuth();
  const isGuest = localStorage.getItem("isGuest") === "true";

  if (!token && !isGuest) return <Navigate to="/signup" />;

  return children;
};

const AuthRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signup" />;
};

const ChatRoute = ({ children }) => {
  const { token } = useAuth();
  const isGuest = localStorage.getItem("isGuest") === "true";

  const interests = JSON.parse(
    localStorage.getItem(
      isGuest ? "guestInterests" : "userInterests"
    ) || "[]"
  );

  if (!token && !isGuest) return <Navigate to="/signup" />;
  if (!interests.length) return <Navigate to="/interests" />;

  return children;
};

const HomeRedirect = () => {
  const { token } = useAuth();
  const isGuest = localStorage.getItem("isGuest") === "true";

  if (!token && !isGuest) return <Navigate to="/signup" />;

  const interests = JSON.parse(
    localStorage.getItem(
      isGuest ? "guestInterests" : "userInterests"
    ) || "[]"
  );

  if (!interests.length) return <Navigate to="/interests" />;

  return <Navigate to="/chat" />;
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Smart home */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Public */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
  path="/interests"
  element={
    <InterestsRoute>
      <Interests />
    </InterestsRoute>
  }
/>


          {/* Fully protected */}
          <Route
            path="/chat"
            element={
              <ChatRoute>
                <Chat />
              </ChatRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
