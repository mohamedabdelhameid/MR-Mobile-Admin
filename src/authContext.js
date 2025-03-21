import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // ✅ محاكاة تحقق التوكن بدون API
      if (token === "fake_token") {
        setIsAuthenticated(true);
      } else {
        fetch("http://localhost:5000/verify-token", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }, // ✅ إصلاح خطأ التنسيق
        })
          .then((res) => res.json())
          .then((data) => setIsAuthenticated(data.valid))
          .catch(() => setIsAuthenticated(false));
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
