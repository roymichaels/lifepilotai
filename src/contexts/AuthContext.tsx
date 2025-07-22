import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  email: string;
  name?: string;
  level?: number;
  xp?: number;
  unlockedSkills?: string[];
  createdAt?: string;
  lastLoginAt?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ session: any; user: any } | void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { session, user } = await apiLogin(email, password);
      setUser(user as unknown as User | null);
      setIsAuthenticated(!!session);
      return { session, user };
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await apiRegister(email, password);
    } catch (error) {
      console.error("AuthContext - Registration error:", error);
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await apiLogout();
    setIsAuthenticated(false);
    setUser(null);
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