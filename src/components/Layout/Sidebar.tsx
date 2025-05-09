
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  BarChart,
  FileText,
  Package,
  Wrench,
  Truck,
  Users,
  AlertTriangle,
  PercentSquare,
  Percent,
  Tags,
  ListFilter,
} from "lucide-react";

import { SidebarItem } from "./components/SidebarItem";
import { SidebarCollapse } from "./components/SidebarCollapse";
import { SidebarHeader, SidebarFooter } from "./components/SidebarAccount";
import { useSidebarNavigation } from "./hooks/useSidebarNavigation";

export function Sidebar() {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { currentPath, isActive, isPartOfPath } = useSidebarNavigation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background",
      isMobile ? "w-full" : "w-64"
    )}>
      <SidebarHeader />
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium space-y-1">
          <SidebarItem
            icon={BarChart}
            label="Dashboard"
            to="/dashboard"
            active={isActive("/dashboard")}
          />
          
          <SidebarCollapse
            icon={Truck}
            label="Machine Management"
            defaultOpen={isPartOfPath("machine")}
          >
            <SidebarItem
              icon={Package}
              label="Machines"
              to="/machines"
              active={isActive("/machines")}
            />
            <SidebarItem
              icon={Tags}
              label="Categories"
              to="/machine-categories"
              active={isActive("/machine-categories")}
            />
          </SidebarCollapse>
          
          <SidebarCollapse
            icon={Wrench}
            label="Service Management"
            defaultOpen={isPartOfPath("service")}
          >
            <SidebarItem
              icon={Wrench}
              label="Services"
              to="/services"
              active={isActive("/services")}
            />
            <SidebarItem
              icon={ListFilter}
              label="Categories"
              to="/service-categories"
              active={isActive("/service-categories")}
            />
          </SidebarCollapse>
          
          <SidebarItem
            icon={Users}
            label="Customers"
            to="/customers"
            active={isActive("/customers")}
          />
          
          <SidebarItem
            icon={FileText}
            label="Quotes"
            to="/quotes"
            active={isActive("/quotes")}
          />
          
          <SidebarItem
            icon={AlertTriangle}
            label="Risk Assessment"
            to="/risk-assessment"
            active={isActive("/risk-assessment")}
          />
          
          <SidebarCollapse
            icon={PercentSquare}
            label="Spread Management"
            defaultOpen={isPartOfPath("spreads")}
          >
            <SidebarItem
              icon={Percent}
              label="Bureau Spreads"
              to="/credit-bureau-spreads"
              active={isActive("/credit-bureau-spreads")}
            />
            <SidebarItem
              icon={Percent}
              label="Rating Spreads"
              to="/internal-rating-spreads"
              active={isActive("/internal-rating-spreads")}
            />
          </SidebarCollapse>
        </nav>
      </div>
      <SidebarFooter />
    </div>
  );
}
