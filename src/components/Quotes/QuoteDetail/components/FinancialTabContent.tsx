
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FinancialTabContentProps {
  quote: any;
}

// Helper function to safely format numbers
const safeFormat = (value: any, defaultValue: string = "0.00", options = {}) => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return defaultValue;
  }
  return Number(value).toLocaleString(undefined, options);
};

const FinancialTabContent = ({ quote }: FinancialTabContentProps) => {
  const { total_fee, quote_data = {} } = quote;
  const quoteDetails = quote_data || {};
  
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
              <dd>{safeFormat(quoteDetails.baseRate, "5")}%</dd>
              
              <dt className="text-muted-foreground">Credit Bureau Spread:</dt>
              <dd>{safeFormat(quoteDetails.bureauSpread, "0", {maximumFractionDigits: 2})}%</dd>
              
              <dt className="text-muted-foreground">Internal Rating Spread:</dt>
              <dd>{safeFormat(quoteDetails.ratingSpread, "0", {maximumFractionDigits: 2})}%</dd>
              
              <dt className="text-muted-foreground font-medium">Total Interest Rate:</dt>
              <dd className="font-medium">{safeFormat(quoteDetails.totalRate, "0", {maximumFractionDigits: 2})}%</dd>
            </dl>
          </div>
          <div>
            <h3 className="text-md font-medium mb-2">Fee Structure</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Equipment Fee:</dt>
              <dd>${safeFormat(quoteDetails.equipmentFee, "0.00", {maximumFractionDigits: 2})}/month</dd>
              
              <dt className="text-muted-foreground">Services Fee:</dt>
              <dd>${safeFormat(quoteDetails.servicesFee, "0.00", {maximumFractionDigits: 2})}/month</dd>
              
              <dt className="text-muted-foreground">Risk Fee:</dt>
              <dd>${safeFormat(quoteDetails.riskFee, "0.00", {maximumFractionDigits: 2})}/month</dd>
              
              <dt className="text-muted-foreground font-medium">Total Monthly Fee:</dt>
              <dd className="font-medium">${safeFormat(total_fee, "0.00", {maximumFractionDigits: 2})}/month</dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialTabContent;
