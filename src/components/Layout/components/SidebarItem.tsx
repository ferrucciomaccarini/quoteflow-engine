
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Types for sidebar items
export interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

// SidebarItem component for regular menu links
export const SidebarItem = ({ icon: Icon, label, to, active, onClick }: SidebarItemProps) => (
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
