
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure auth state is properly initialized
    const timer = setTimeout(() => {
      setChecked(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log("Index page auth state:", { isAuthenticated, isLoading, checked });
  }, [isAuthenticated, isLoading, checked]);

  if (isLoading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("Index page redirecting to:", isAuthenticated ? "/dashboard" : "/login");
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/login" />;
};

export default Index;
