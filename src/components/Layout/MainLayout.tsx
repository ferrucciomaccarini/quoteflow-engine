
import React, { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Logo from "@/components/common/Logo";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
        <header className="bg-white shadow-sm p-4 border-b">
          <div className="flex flex-col items-center mb-2">
            <Logo />
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
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
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
