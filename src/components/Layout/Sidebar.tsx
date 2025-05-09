
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  FileText,
  Package,
  Cog,
  LogOut,
  ChevronRight,
  ChevronDown,
  Wrench,
  Truck,
  Users,
  AlertTriangle,
  PercentSquare,
  Percent,
  Tags,
  ListFilter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Types for sidebar items
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarCollapseProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// SidebarItem component for regular menu links
const SidebarItem = ({ icon: Icon, label, to, active, onClick }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
      active && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
    )}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

// SidebarCollapse component for collapsible menu sections
const SidebarCollapse = ({ icon: Icon, label, children, defaultOpen = false }: SidebarCollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
          <div className="ml-auto">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-10 space-y-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span className="text-lg">EaaS Portal</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium space-y-1">
          <SidebarItem
            icon={BarChart}
            label="Dashboard"
            to="/dashboard"
            active={location.pathname === "/dashboard"}
          />
          
          <SidebarCollapse
            icon={Truck}
            label="Machine Management"
            defaultOpen={location.pathname.includes("machine")}
          >
            <SidebarItem
              icon={Package}
              label="Machines"
              to="/machines"
              active={location.pathname === "/machines"}
            />
            <SidebarItem
              icon={Tags}
              label="Categories"
              to="/machine-categories"
              active={location.pathname === "/machine-categories"}
            />
          </SidebarCollapse>
          
          <SidebarCollapse
            icon={Wrench}
            label="Service Management"
            defaultOpen={location.pathname.includes("service")}
          >
            <SidebarItem
              icon={Wrench}
              label="Services"
              to="/services"
              active={location.pathname === "/services"}
            />
            <SidebarItem
              icon={ListFilter}
              label="Categories"
              to="/service-categories"
              active={location.pathname === "/service-categories"}
            />
          </SidebarCollapse>
          
          <SidebarItem
            icon={Users}
            label="Customers"
            to="/customers"
            active={location.pathname === "/customers"}
          />
          
          <SidebarItem
            icon={FileText}
            label="Quotes"
            to="/quotes"
            active={location.pathname === "/quotes"}
          />
          
          <SidebarItem
            icon={AlertTriangle}
            label="Risk Assessment"
            to="/risk-assessment"
            active={location.pathname === "/risk-assessment"}
          />
          
          <SidebarCollapse
            icon={PercentSquare}
            label="Spread Management"
            defaultOpen={location.pathname.includes("spreads")}
          >
            <SidebarItem
              icon={Percent}
              label="Bureau Spreads"
              to="/credit-bureau-spreads"
              active={location.pathname === "/credit-bureau-spreads"}
            />
            <SidebarItem
              icon={Percent}
              label="Rating Spreads"
              to="/internal-rating-spreads"
              active={location.pathname === "/internal-rating-spreads"}
            />
          </SidebarCollapse>
        </nav>
      </div>
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
    </div>
  );
}
