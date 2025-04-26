import { Transaction } from "@/components/TransactionHistory";
import { Keypair } from "@solana/web3.js";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  address: string;
  keyPairSigner: Keypair;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  addTransaction: (txId: string, amount: number, address: string) => void;
  login: (userData: User) => void;
  logout: () => void;
};

export const AUTH_FLAG_KEY = "wallet_auth";
export const REGISTRATION_FLAG_KEY = "registration-flag";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txIntervalId, setTxIntervalId] = useState<NodeJS.Timeout|null>()

  useEffect(() => {
    const updateTransactions = () => {
      const localTransactions = localStorage.getItem("transactions")
      if (localTransactions) {
        const parsedTransactions = JSON.parse(localTransactions)
        setTransactions([...parsedTransactions])
      }
    }

    updateTransactions()
    const id = setInterval(updateTransactions, 2_000)
    setTxIntervalId(id)

    return () => {
      if (txIntervalId) {
        clearInterval(txIntervalId)
      }
    };
  }, []);

  const addTransaction = (txId: string, amount: number, address: string) => {
    const date = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const newTransaction: Transaction = {
      id: txId,
      type: "sent",
      amount,
      address,
      date
    }
    const tempTransactions = [...transactions, newTransaction]
    setTransactions(tempTransactions)
    localStorage.setItem('transactions', JSON.stringify(tempTransactions))
  }

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(AUTH_FLAG_KEY, "true");
    localStorage.setItem(REGISTRATION_FLAG_KEY, "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_FLAG_KEY);
  };

  const value = {
    user,
    isAuthenticated: user !== null,
    transactions,
    addTransaction,
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
