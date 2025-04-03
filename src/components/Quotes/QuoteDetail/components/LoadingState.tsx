
import React from "react";

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span>Loading quote details...</span>
      </div>
    </div>
  );
};

export default LoadingState;
