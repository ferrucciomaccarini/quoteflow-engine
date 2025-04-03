
import React from "react";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";

interface NotFoundStateProps {
  navigate: NavigateFunction;
}

const NotFoundState = ({ navigate }: NotFoundStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-medium mb-2">Quote Not Found</h2>
      <p className="text-muted-foreground mb-4">The requested quote could not be found.</p>
      <Button onClick={() => navigate('/quotes')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Quotes
      </Button>
    </div>
  );
};

export default NotFoundState;
