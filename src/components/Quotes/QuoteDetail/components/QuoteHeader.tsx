
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface QuoteHeaderProps {
  quote: any;
  navigate: NavigateFunction;
  statusBadge: React.ReactNode;
}

const QuoteHeader = ({ quote, navigate, statusBadge }: QuoteHeaderProps) => {
  const quoteDate = new Date(quote.created_at).toLocaleDateString();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Button>
          {statusBadge}
        </div>
        <h1 className="text-3xl font-bold mt-4">Quote Details</h1>
        <p className="text-muted-foreground">
          Quote created on {quoteDate}
        </p>
      </div>
    </div>
  );
};

export default QuoteHeader;
