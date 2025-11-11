import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Cog, Package } from "lucide-react";
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
  const location = useLocation();

  return (
    <div className="mt-auto p-4 border-t">
      <SidebarItem 
        icon={Cog} 
        label="Impostazioni" 
        to="/settings"
        active={location.pathname === "/settings"}
      />
    </div>
  );
};
