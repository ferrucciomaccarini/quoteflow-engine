
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FinancialTabContentProps {
  quote: any;
}

const FinancialTabContent = ({ quote }: FinancialTabContentProps) => {
  const { total_fee, quote_data = {} } = quote;
  const quoteDetails = quote_data;
  
  // Safe formatting function to handle null/undefined values
  const safeFormat = (value: any) => {
    return value !== null && value !== undefined 
      ? value.toLocaleString(undefined, {maximumFractionDigits: 2})
      : "0.00";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-2">Interest Rates</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Base Rate:</dt>
              <dd>{quoteDetails.baseRate || 5}%</dd>
              <dt className="text-muted-foreground">Credit Bureau Spread:</dt>
              <dd>{quoteDetails.bureauSpread ? quoteDetails.bureauSpread.toFixed(2) : "0.00"}%</dd>
              <dt className="text-muted-foreground">Internal Rating Spread:</dt>
              <dd>{quoteDetails.ratingSpread ? quoteDetails.ratingSpread.toFixed(2) : "0.00"}%</dd>
              <dt className="text-muted-foreground font-medium">Total Interest Rate:</dt>
              <dd className="font-medium">{quoteDetails.totalRate ? quoteDetails.totalRate.toFixed(2) : "0.00"}%</dd>
            </dl>
          </div>
          <div>
            <h3 className="text-md font-medium mb-2">Fee Structure</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Equipment Fee:</dt>
              <dd>${safeFormat(quoteDetails.equipmentFee)}/month</dd>
              <dt className="text-muted-foreground">Services Fee:</dt>
              <dd>${safeFormat(quoteDetails.servicesFee)}/month</dd>
              <dt className="text-muted-foreground">Risk Fee:</dt>
              <dd>${safeFormat(quoteDetails.riskFee)}/month</dd>
              <dt className="text-muted-foreground font-medium">Total Monthly Fee:</dt>
              <dd className="font-medium">${safeFormat(total_fee)}/month</dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialTabContent;
