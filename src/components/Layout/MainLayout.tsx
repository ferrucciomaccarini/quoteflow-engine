
import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Logo from "@/components/common/Logo";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Add debug logging for authentication state
  useEffect(() => {
    console.log("MainLayout auth state:", { isAuthenticated, isLoading, userId: user?.id, sessionActive: !!session });
  }, [isAuthenticated, isLoading, user, session]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login from MainLayout");
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="default"
            size="icon"
            className="rounded-full shadow-lg"
          >
            <Menu />
          </Button>
        </div>
      )}
      
      {/* Sidebar - conditionally rendered based on state */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block ${isMobile ? 'fixed inset-0 z-40 bg-black/50' : ''}`} onClick={isMobile ? () => setSidebarOpen(false) : undefined}>
        <div className={`${isMobile ? 'w-64 h-full' : ''}`} onClick={e => e.stopPropagation()}>
          <Sidebar />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 border-b">
          <div className="flex flex-col items-center mb-2">
            <Logo />
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              {user?.companyName || "Dashboard"}
            </h1>
            <div className="text-sm text-gray-600">
              {user?.role === "owner" && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Owner
                </span>
              )}
            </div>
          </div>
        </header>
        <main className="p-3 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
