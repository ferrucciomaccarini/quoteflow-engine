
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cog, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarItem } from "./SidebarItem";

export const SidebarHeader = () => {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Package className="h-6 w-6" />
        <span className="text-lg">EaaS Portal</span>
      </Link>
    </div>
  );
};

export const SidebarFooter = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  return (
    <div className="mt-auto p-4 border-t">
      <div className="flex gap-2 justify-between items-center">
        <SidebarItem 
          icon={Cog} 
          label="Settings" 
          to="/settings"
          active={location.pathname === "/settings"}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-9 w-9"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
