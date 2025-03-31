
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wrench, 
  ClipboardList, 
  Menu, 
  Settings, 
  LogOut,
  BarChart3,
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon: Icon, label, active }: NavItemProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2",
          active && "bg-muted"
        )}
      >
        <Icon size={20} />
        <span className="truncate">{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { isMobile, sidebarOpen, setSidebarOpen } = useMobile();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/machines", label: "Machines", icon: Wrench },
    { path: "/services", label: "Services", icon: ClipboardList },
    { path: "/quotes", label: "Quotes", icon: ClipboardList },
    { path: "/risk-assessment", label: "Risk Assessment", icon: AlertTriangle },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isMobile && !sidebarOpen) {
    return (
      <div className="fixed top-0 left-0 p-3 z-40">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-muted/10 border-r border-border overflow-auto",
        isMobile
          ? "fixed z-40 w-[240px] transition-all duration-300 ease-in-out"
          : "w-[240px] sticky top-0"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-lg font-semibold">Pmix EaaS</h1>
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu size={18} />
          </Button>
        )}
      </div>
      <div className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
          />
        ))}
      </div>
      <div className="p-4 border-t border-border mt-auto">
        <div className="mb-4">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="w-full gap-1" asChild>
            <Link to="/settings">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1"
            onClick={logout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
