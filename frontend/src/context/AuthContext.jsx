import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );


  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

 const logout = () => {
  // Auth
  localStorage.removeItem("token");

  // User-specific data
  localStorage.removeItem("userInterests");

  // Guest cleanup (future-proof)
  localStorage.removeItem("isGuest");
  localStorage.removeItem("guestInterests");

  setToken(null);
};


  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
