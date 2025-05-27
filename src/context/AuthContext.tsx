
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "sales";
  companyId: string;
  companyName: string;
}

interface AuthContextProps {
  user: UserProfile | null;
  session: Session | null; 
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession && currentSession.user) {
          // Use setTimeout to defer the profile fetch and prevent deadlock
          setTimeout(() => {
            fetchUserProfile(currentSession.user);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Existing session check:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession && currentSession.user) {
        fetchUserProfile(currentSession.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log("Fetching profile for user:", authUser.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create a basic one from auth user data
        if (error.code === 'PGRST116') {
          console.log("Profile not found, user might need to complete setup");
          setUser({
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
            email: authUser.email || '',
            role: 'owner',
            companyId: '0',
            companyName: 'Default Company'
          });
        } else {
          setUser(null);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
        }
      } else if (data) {
        console.log("Profile data retrieved:", data);
        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          role: data.role as "admin" | "owner" | "sales",
          companyId: data.company_id || '',
          companyName: data.company_name || ''
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log("Attempting login for:", email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Login successful:", data.user?.id);
      // User profile will be fetched by the onAuthStateChange listener
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    console.log("Attempting registration for:", email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        throw error;
      }
      
      console.log("Registration successful:", data.user?.id);
      // User profile will be created by database trigger and 
      // then fetched by the onAuthStateChange listener
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log("Attempting logout");
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const isAuthenticated = !!user && !!session;
  
  console.log("Auth context state:", { 
    isAuthenticated, 
    isLoading, 
    userId: user?.id, 
    sessionActive: !!session 
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isOwner: user?.role === "owner"
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
