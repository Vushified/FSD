import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/api";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore and verify the login when the app opens.
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = localStorage.getItem("eventHubToken");
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (active) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem("eventHubToken");
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const data = await loginUser({ email, password });
    localStorage.setItem("eventHubToken", data.token);
    setUser(data.user);
    return data;
  }

  async function register(name, email, password) {
    const data = await registerUser({
      name,
      email,
      password,
    });
    localStorage.setItem("eventHubToken", data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("eventHubToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
