
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "sales";
  companyId: string;
  companyName: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem("pmix_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // In a real app, this would connect to an authentication API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users for demo
      const mockUsers: Record<string, User> = {
        "admin@paradigmix.com": {
          id: "1",
          name: "Admin User",
          email: "admin@paradigmix.com",
          role: "admin",
          companyId: "0",
          companyName: "Paradigmix"
        },
        "owner@machinery.com": {
          id: "2",
          name: "Machinery Owner",
          email: "owner@machinery.com",
          role: "owner",
          companyId: "1",
          companyName: "Machinery Corp"
        },
        "sales@machinery.com": {
          id: "3",
          name: "Sales Rep",
          email: "sales@machinery.com",
          role: "sales",
          companyId: "1",
          companyName: "Machinery Corp"
        }
      };

      const foundUser = mockUsers[email];
      
      if (foundUser && password === "password") {
        setUser(foundUser);
        localStorage.setItem("pmix_user", JSON.stringify(foundUser));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("pmix_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
