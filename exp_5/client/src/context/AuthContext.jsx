import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("eventHubUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function login(email) {
    const loggedInUser = {
      name: email.split("@")[0],
      email: email,
    };

    setUser(loggedInUser);
    localStorage.setItem(
      "eventHubUser",
      JSON.stringify(loggedInUser)
    );
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("eventHubUser");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
