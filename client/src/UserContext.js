import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          // If not logged in or session expired
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserInfo(data);
        } else {
          setUserInfo(null);
        }
      })
      .catch(() => {
        // Network error or invalid token, do nothing
        setUserInfo(null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
