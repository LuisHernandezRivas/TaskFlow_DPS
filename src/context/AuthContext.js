"use client";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
 
  // Restaurar sesión desde sessionStorage al recargar
  useEffect(() => {
    try {
      const session = sessionStorage.getItem("session");
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch {
      sessionStorage.removeItem("session");
    }
  }, []);
 
  const login = (userData) => {
    sessionStorage.setItem("session", JSON.stringify(userData));
    setUser(userData);
  };
 
  const logout = () => {
    sessionStorage.removeItem("session");
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
 
