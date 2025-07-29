/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WakuIdentityService, type WakuIdentity } from '@/services/WakuIdentityService'

type User = WakuIdentity;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = !!localStorage.getItem("accessToken");
    if (import.meta.env.DEV)
      console.log("AuthProvider - Initial authentication state:", hasToken);
    return hasToken;
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV)
      console.log('AuthContext - User state changed:', user)
  }, [user])

  useEffect(() => {
    WakuIdentityService.getIdentity().then(identity => {
      if (identity) {
        setUser(identity)
        setIsAuthenticated(true)
      }
    })
  }, [])
  const login = async () => {
    const identity = await WakuIdentityService.createIdentity()
    setUser(identity)
    setIsAuthenticated(true)
  }

  const register = async () => {
    const identity = await WakuIdentityService.createIdentity()
    setUser(identity)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await WakuIdentityService.clearIdentity()
    localStorage.removeItem('accessToken')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
