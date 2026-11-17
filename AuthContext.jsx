import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "pennywise_users";
const SESSION_KEY = "pennywise_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function register({ name, email, password }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.some((item) => item.email === email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }
    users.push({ id: crypto.randomUUID(), name, email: email.toLowerCase(), password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find((item) => item.email === email.toLowerCase() && item.password === password);
    if (!found) return { success: false, message: "Incorrect email or password." };
    setUser({ id: found.id, name: found.name, email: found.email });
    return { success: true };
  }

  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}