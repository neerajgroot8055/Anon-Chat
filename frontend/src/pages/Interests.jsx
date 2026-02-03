import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const isGuest = localStorage.getItem("isGuest") === "true";
import AuthLayout from "../components/AuthLayout";
import Logo from "../components/Logo";

const PREDEFINED_INTERESTS = [
  "tech",
  "movies",
  "anime",
  "fitness",
  "music",
  "gaming",
  "travel",
];

const Interests = () => {
    const navigate = useNavigate();

  const { token } = useAuth();
  const [selected, setSelected] = useState([]);
  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;
    if (selected.includes(customInterest)) return;

    setSelected([...selected, customInterest.trim()]);
    setCustomInterest("");
  };

  const saveInterests = async () => {
  if (!selected.length) {
    alert("Select at least one interest");
    return;
  }

  // 🟢 GUEST FLOW
  if (isGuest) {
    localStorage.setItem(
      "guestInterests",
      JSON.stringify(selected)
    );
    navigate("/chat");
    return;
  }

  // 🔐 AUTH USER FLOW
  setLoading(true);

  try {
    const res = await fetch(
      "http://localhost:3000/api/user/interests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selected }),
      }
    );

    if (!res.ok) {
      alert("Failed to save interests");
      return;
    }

    // Save locally for routing protection
    localStorage.setItem(
      "userInterests",
      JSON.stringify(selected)
    );

    navigate("/chat");
  } catch {
    alert("Server error");
  } finally {
    setLoading(false);
  }
};


  return (
 
  <AuthLayout>
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Choose your interests
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isGuest
            ? "Guest mode — interests won’t be saved"
            : "This helps us find better matches"}
        </p>
      </div>

      {/* Predefined interests */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PREDEFINED_INTERESTS.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              selected.includes(interest)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Custom interest */}
      <div className="flex gap-2">
        <input
          placeholder="Add custom interest"
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addCustomInterest}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200"
        >
          Add
        </button>
      </div>

      {/* Selected interests preview */}
      {selected.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Selected:{" "}
          <span className="font-medium text-gray-800">
            {selected.join(", ")}
          </span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={saveInterests}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  </AuthLayout>

  );
};

export default Interests;
