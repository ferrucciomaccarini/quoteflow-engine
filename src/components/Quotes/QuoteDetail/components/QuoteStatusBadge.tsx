
import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface QuoteStatusBadgeProps {
  status: string;
}

const QuoteStatusBadge = ({ status }: QuoteStatusBadgeProps) => {
  switch(status) {
    case 'Approved':
      return <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3" /> Approved</div>;
    case 'Rejected':
      return <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3" /> Rejected</div>;
    default:
      return <div className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3" /> {status}</div>;
  }
};

export default QuoteStatusBadge;
