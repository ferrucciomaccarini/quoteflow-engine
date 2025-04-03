
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RisksTabContentProps {
  quote: any;
}

const RisksTabContent = ({ quote }: RisksTabContentProps) => {
  const { quote_data = {} } = quote;
  const quoteDetails = quote_data;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        {quoteDetails.riskData?.riskVariables ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Risk Domain</th>
                    <th className="text-left p-2">Variable</th>
                    <th className="text-right p-2">Frequency</th>
                    <th className="text-right p-2">Max Loss</th>
                    <th className="text-right p-2">Mitigation</th>
                    <th className="text-right p-2">Residual Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteDetails.riskData.riskVariables.map((risk: any, index: number) => (
                    <tr key={risk.id || index} className="border-b">
                      <td className="p-2">{risk.domain}</td>
                      <td className="p-2">{risk.variable}</td>
                      <td className="text-right p-2">{risk.frequency}%</td>
                      <td className="text-right p-2">${risk.maxLoss?.toLocaleString()}</td>
                      <td className="text-right p-2">{risk.mitigation}%</td>
                      <td className="text-right p-2 font-medium">${risk.residualRisk?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-2 bg-muted rounded-md">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Total Residual Risk:</span>
                <p className="font-bold">${quoteDetails.totalResidualRisk?.toLocaleString() || "0"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No risk assessment data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RisksTabContent;
