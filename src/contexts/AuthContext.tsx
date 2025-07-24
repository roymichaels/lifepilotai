import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../api/auth";

type User = {
  id: string;
  email: string;
  name?: string;
  level?: number;
  xp?: number;
  unlockedSkills?: string[];
  createdAt?: string;
  lastLoginAt?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = !!localStorage.getItem("accessToken");
    console.log("AuthProvider - Initial authentication state:", hasToken);
    return hasToken;
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("AuthContext - User state changed:", user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext - Starting login process");
      const response = await apiLogin(email, password);
      console.log("AuthContext - Login API response:", response);

      if (response?.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);

        // Set user data if provided in login response
        if (response.user) {
          console.log("AuthContext - Setting user data from login response:", response.user);
          const adminUser = {
            ...response.user,
            isAdmin: response.user.email === 'deandeanazulay@gmail.com'
          };
          setUser(adminUser);
        }
        
        setIsAuthenticated(true);
        console.log("AuthContext - Login successful, authentication state set to true");
      } else {
        console.log("AuthContext - Login failed - no access token received");
        throw new Error('Login failed - no access token received');
      }
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log("AuthContext - Starting registration process");
      const response = await apiRegister(email, password);
      console.log("AuthContext - Registration successful");
      // Registration successful - user needs to login separately
    } catch (error) {
      console.error("AuthContext - Registration error:", error);
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    console.log("AuthContext - Logging out user");
    await apiLogout();
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
    window.location.reload();
  };

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
