
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CalculationsTabContentProps {
  quote: any;
}

const CalculationsTabContent = ({ quote }: CalculationsTabContentProps) => {
  const { quote_data = {} } = quote;
  const quoteDetails = quote_data;
  const [activeTable, setActiveTable] = useState<'equipment' | 'services' | 'risk'>('equipment');

  // Get quote calculations
  const equipmentAmortization = quoteDetails.equipmentAmortization || [];
  const servicesAmortization = quoteDetails.servicesAmortization || [];
  const riskAmortization = quoteDetails.riskAmortization || [];
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Get current items based on active table
  let currentItems: any[] = [];
  let tableName = "";
  let initialValue = 0;
  let residualValue = 0;
  
  switch(activeTable) {
    case 'equipment':
      currentItems = equipmentAmortization.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      tableName = "Equipment Amortization Schedule";
      initialValue = quoteDetails.machineValue || 0;
      residualValue = quoteDetails.residualValue || 0;
      break;
    case 'services':
      currentItems = servicesAmortization.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      tableName = "Services Amortization Schedule";
      initialValue = quoteDetails.servicesPresentValue || 0;
      residualValue = 0;
      break;
    case 'risk':
      currentItems = riskAmortization.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      tableName = "Risk Amortization Schedule";
      initialValue = quoteDetails.totalResidualRisk || 0;
      residualValue = 0;
      break;
  }
  
  // Calculate total number of pages
  const totalPages = Math.ceil((activeTable === 'equipment' ? equipmentAmortization.length : 
                              activeTable === 'services' ? servicesAmortization.length : 
                              riskAmortization.length) / itemsPerPage);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Costs by Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Time Horizon</TableCell>
                  <TableCell className="text-right">{quoteDetails.timeHorizon || quoteDetails.contractDuration || 0} months</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Annual Usage Intensity</TableCell>
                  <TableCell className="text-right">{quoteDetails.intensityHours || 0} hours/year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Daily Work Shifts</TableCell>
                  <TableCell className="text-right">{quoteDetails.dailyShifts || 1} shift(s)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Discount Rate</TableCell>
                  <TableCell className="text-right">{quoteDetails.totalRate?.toFixed(2) || 0}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Present Value of Services</TableCell>
                  <TableCell className="text-right">${quoteDetails.servicesPresentValue?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Service Costs by Year</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quoteDetails.serviceEvents && 
                    Array.from(
                      { length: Math.min(10, Math.ceil((quoteDetails.timeHorizon || quoteDetails.contractDuration || 0) / 12)) }, 
                      (_, i) => i + 1
                    ).map((year) => {
                      const yearCosts = quoteDetails.serviceEvents
                        .filter((event: any) => Math.ceil(event.month / 12) === year)
                        .reduce((sum: number, event: any) => sum + event.cost, 0);
                      
                      return (
                        <TableRow key={`year-${year}`}>
                          <TableCell>Year {year}</TableCell>
                          <TableCell className="text-right">${yearCosts.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Amortization Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex space-x-2">
              <Button 
                variant={activeTable === 'equipment' ? "default" : "outline"}
                onClick={() => {
                  setActiveTable('equipment');
                  setCurrentPage(1);
                }}
              >
                Equipment
              </Button>
              <Button 
                variant={activeTable === 'services' ? "default" : "outline"}
                onClick={() => {
                  setActiveTable('services');
                  setCurrentPage(1);
                }}
              >
                Services
              </Button>
              <Button 
                variant={activeTable === 'risk' ? "default" : "outline"}
                onClick={() => {
                  setActiveTable('risk');
                  setCurrentPage(1);
                }}
              >
                Risk
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{tableName}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Remaining Capital</TableHead>
                    <TableHead className="text-right">Capital Portion</TableHead>
                    <TableHead className="text-right">Interest Portion</TableHead>
                    <TableHead className="text-right">Monthly Fee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Initial</TableCell>
                    <TableCell className="text-right font-semibold">${initialValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                  
                  {currentItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.month}</TableCell>
                      <TableCell className="text-right">${item.remainingCapital.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right">${item.capitalPortion.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right">${item.interestPortion.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right">${item.fee.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  
                  {residualValue > 0 && (
                    <TableRow>
                      <TableCell className="font-semibold">Residual</TableCell>
                      <TableCell className="text-right font-semibold">${residualValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculationsTabContent;
