
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Box, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardList, 
  HomeIcon, 
  Settings, 
  User, 
  Wrench 
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: HomeIcon,
      path: "/dashboard",
      roles: ["admin", "owner", "sales"]
    },
    {
      name: "Quotes",
      icon: ClipboardList,
      path: "/quotes",
      roles: ["admin", "owner", "sales"]
    },
    {
      name: "Machines",
      icon: Box,
      path: "/machines",
      roles: ["admin", "owner"]
    },
    {
      name: "Services",
      icon: Wrench,
      path: "/services",
      roles: ["admin", "owner"]
    },
    {
      name: "Risk Management",
      icon: BarChart3,
      path: "/risk-management",
      roles: ["admin", "owner"]
    },
    {
      name: "Calculator",
      icon: Calculator,
      path: "/calculator",
      roles: ["admin", "owner", "sales"]
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["admin", "owner"]
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div 
      className={`bg-sidebar h-screen flex flex-col ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-sidebar-foreground font-bold text-xl">
            <span className="text-primary-foreground">Pmix</span> EaaS
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent rounded p-1"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <nav className="mt-4">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${
                      collapsed ? "justify-center" : "justify-start"
                    } px-4 py-2 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    } transition-colors rounded-sm mx-2`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="bg-sidebar-accent rounded-full p-2">
            <User size={collapsed ? 20 : 24} className="text-sidebar-foreground" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="text-sm font-medium text-sidebar-foreground">
                {user?.name}
              </div>
              <button
                onClick={logout}
                className="text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
