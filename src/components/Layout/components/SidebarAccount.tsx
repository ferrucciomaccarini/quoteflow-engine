
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cog, LogOut, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarItem } from "./SidebarItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Disconnesso",
        description: "Sei stato disconnesso con successo",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Errore",
        description: "Errore durante la disconnessione",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-auto p-4 border-t">
      <div className="flex gap-2 justify-between items-center">
        <SidebarItem 
          icon={Cog} 
          label="Impostazioni" 
          to="/settings"
          active={location.pathname === "/settings"}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user?.name || user?.email}
            </div>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnetti
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
