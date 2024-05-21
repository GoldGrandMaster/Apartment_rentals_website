import { createContext, useEffect, useState } from "react";
import Axios from "../config/axios";

interface AuthContextType {
  user: User | null
  setUser: Function
  setTokens: Function
  isLoggedIn: boolean
  setIsLoggedIn: Function
  logout: Function
}

export const authContext = createContext<AuthContextType>({
  user: null,
  setUser: (e: User) => e,
  setTokens: (e: Tokens) => e,
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  logout: () => { }
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const setTokens = (tokens: Tokens) => {
    // Axios.defaults.headers.common["Authorization"] = tokens.access.token;
    localStorage.setItem("accessToken", tokens.access.token)
    localStorage.setItem("refreshToken", tokens.refresh.token)
  }

  const logout = () => {
    Axios.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") })
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setIsLoggedIn(false);
      }).catch(err => {
        console.error(err);
      })
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || "";
    const refreshToken = localStorage.getItem("refreshToken") || "";

    if (!refreshToken)
      return setIsLoggedIn(false);

    Axios.post("/auth/login-jwt", null, {
      headers: {
        Authorization: refreshToken
      }
    })
      .then(res => {
        const user = res.data;
        setUser(user);
        setTokens({
          access: { token: accessToken },
          refresh: { token: refreshToken }
        })
      })
      .catch(error => {
        console.error(error);
        setIsLoggedIn(false);
      })
  }, [])

  return (
    <authContext.Provider value={{ user, setUser, setTokens, isLoggedIn, logout, setIsLoggedIn }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider;