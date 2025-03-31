
import React from "react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <img 
        src="/lovable-uploads/c71c809c-407e-4219-a7fe-297fb199d36a.png" 
        alt="Paradigmix Logo" 
        className="h-16" 
      />
    </div>
  );
};

export default Logo;
