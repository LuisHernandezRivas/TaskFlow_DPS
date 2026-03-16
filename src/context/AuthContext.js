"use client";
import { createContext, useState, useEffect } from "react";

export const authContext = createContext();
export function AuthProvider({ children }) {
  const[user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("session");

    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);
  const login = (userData) => {
    localStorage.setItem("session", JSON.stringify(userData));
    setUser(userData);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
