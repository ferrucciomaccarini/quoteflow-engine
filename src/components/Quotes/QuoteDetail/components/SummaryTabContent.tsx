
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryTabContentProps {
  quote: any;
}

const SummaryTabContent = ({ quote }: SummaryTabContentProps) => {
  const { total_fee, quote_data = {} } = quote;
  const quoteDetails = quote_data;
  
  const timeHorizon = quoteDetails.timeHorizon || quoteDetails.contractDuration || 36;
  
  // Safe formatting function to handle null/undefined values
  const safeFormat = (value: any) => {
    return value !== null && value !== undefined 
      ? value.toLocaleString(undefined, {maximumFractionDigits: 2})
      : "0.00";
  };

  // Calculate contract total with null check
  const monthlyFee = quoteDetails.totalFee || total_fee || 0;
  const contractTotal = monthlyFee * timeHorizon;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Quote Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Fee</p>
              <p className="text-2xl font-bold">${safeFormat(total_fee)}/month</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contract Duration</p>
              <p className="text-xl font-medium">{timeHorizon} months</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contract Total</p>
              <p className="text-xl font-medium">
                ${safeFormat(contractTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{quote.machine_name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Value: ${safeFormat(quoteDetails.machineValue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            {quoteDetails.selectedServices?.length ? (
              <>
                <p className="font-medium">{quoteDetails.selectedServices.length} service(s) selected</p>
                <div className="mt-2 max-h-[200px] overflow-y-auto border rounded-md">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr className="border-b">
                        <th className="text-left p-2">Service</th>
                        <th className="text-right p-2">Parts</th>
                        <th className="text-right p-2">Labor</th>
                        <th className="text-right p-2">Consumables</th>
                        <th className="text-right p-2">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteDetails.selectedServices.map((service: any) => {
                        const partsCost = service.parts_cost || 0;
                        const laborCost = service.labor_cost || 0;
                        const consumablesCost = service.consumables_cost || 0;
                        const totalCost = service.totalCost || partsCost + laborCost + consumablesCost;
                        
                        return (
                          <tr key={service.id} className="border-b">
                            <td className="p-2">{service.name}</td>
                            <td className="text-right p-2">${partsCost.toFixed(2)}</td>
                            <td className="text-right p-2">${laborCost.toFixed(2)}</td>
                            <td className="text-right p-2">${consumablesCost.toFixed(2)}</td>
                            <td className="text-right p-2 font-medium">${totalCost.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Value: ${safeFormat(quoteDetails.servicesPresentValue)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No services included</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Usage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Annual Usage Intensity</p>
              <p className="font-medium">{quoteDetails.intensityHours || 0} hours/year</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Work Shifts</p>
              <p className="font-medium">{quoteDetails.dailyShifts || 1} shift(s)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Setup Time</p>
              <p className="font-medium">{quoteDetails.setupTime || 0} hours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTabContent;
