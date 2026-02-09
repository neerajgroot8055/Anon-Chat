import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://anon-chat-i4ph.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          interests: [],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful. Please login.");
        navigate("/");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
  <div className="space-y-4">
    
    <h2 className="text-xl font-semibold text-gray-800 text-center">
      Create your account
    </h2>

    
    <input
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

   
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
      onClick={handleSignup}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
    >
      {loading ? "Creating..." : "Sign Up"}
    </button>

    
    <div className="flex items-center gap-2 text-gray-400 text-xs">
      <div className="flex-1 h-px bg-gray-200" />
      OR
      <div className="flex-1 h-px bg-gray-200" />
    </div>

    
    <button
      onClick={() => navigate("/login")}
      className="w-full text-sm text-indigo-600 hover:underline"
    >
      Already have an account? Login
    </button>

    
    <button
      onClick={() => {
        localStorage.setItem("isGuest", "true");
        navigate("/interests");
      }}
      className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md text-sm hover:bg-indigo-50"
    >
      Continue as Guest
    </button>
  </div>
</AuthLayout>

  );
};

export default Signup;
