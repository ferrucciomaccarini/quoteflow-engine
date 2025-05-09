
import { useLocation } from "react-router-dom";

export function useSidebarNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Helper function to check if a path is active
  const isActive = (path: string) => currentPath === path;
  
  // Helper function to check if a path is part of the current path
  const isPartOfPath = (subPath: string) => currentPath.includes(subPath);
  
  return {
    currentPath,
    isActive,
    isPartOfPath
  };
}
