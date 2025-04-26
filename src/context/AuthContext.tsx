import { Keypair } from "@solana/web3.js";
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  address: string;
  keyPairSigner: Keypair;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

// Local storage key for auth flag
export const AUTH_FLAG_KEY = "wallet_auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(AUTH_FLAG_KEY, "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_FLAG_KEY);
  };

  const value = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
