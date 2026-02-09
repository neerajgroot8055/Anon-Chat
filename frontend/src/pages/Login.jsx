import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://anon-chat-i4ph.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        alert(data.error || "Login failed");
        return;
      }

      
      login(data.token);

      const interests = data.user?.interests || [];

      localStorage.setItem(
        "userInterests",
        JSON.stringify(interests)
      );

      if (interests.length === 0) {
        navigate("/interests");
      } else {
        navigate("/chat");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <AuthLayout>
    <div className="space-y-10">
      
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Welcome back
      </h2>

    
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

     
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

    
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

     
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <div className="flex-1 h-px bg-gray-200" />
        OR
        <div className="flex-1 h-px bg-gray-200" />
      </div>

     
      <button
        onClick={() => navigate("/signup")}
        className="w-full text-sm text-indigo-600 hover:underline"
      >
        New here? Create an account
      </button>
    </div>
  </AuthLayout>

  );
};

export default Login;
