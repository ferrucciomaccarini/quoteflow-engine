
import React from "react";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  isLoading: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

interface ErrorStateProps {
  isError: boolean;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ isError, onRetry }) => {
  if (!isError) return null;
  
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">Failed to load machines data.</p>
      <Button onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};
