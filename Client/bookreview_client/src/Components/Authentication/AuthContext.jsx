import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on page load
  useEffect(() => {
    fetch("http://localhost:3010/check-session", {
      credentials: "include", // Ensure cookies are sent
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));;
  }, []);

  const login = async (credentials) => {
    const res = await fetch("http://localhost:3010/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (res.ok && data.user) {
        setUser(data.user);
    } 
  };

  const logout = async () => {
    await fetch("http://localhost:3010/logout", {
      credentials: "include",
      method: "POST",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
