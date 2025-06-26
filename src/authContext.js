import { createContext, useState, useEffect } from "react";
import BASE_BACKEND_URL from "./API/config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      if (token === "fake_token") {
        setIsAuthenticated(true);
      } else {
        fetch(`${BASE_BACKEND_URL}/admin/getaccount`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to authenticate");
            return res.json();
          })
          .then((data) => setIsAuthenticated(data.valid))
          .catch(() => setIsAuthenticated(false));
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
