import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  calculatePeriodicFee,
  calculateEquipmentAmortization,
  calculateServicesAmortization,
  calculateRiskAmortization
} from "@/utils/calculations";
import { StepComponentProps } from "./types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const SummaryStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const [showAmortizationTables, setShowAmortizationTables] = useState(false);

  React.useEffect(() => {
    const totalResidualRisk = data.totalResidualRisk || 0;
    const contractDuration = data.timeHorizon || data.contractDuration || 36;
    const totalRate = data.totalRate || 5;
    
    const riskFee = calculatePeriodicFee(
      totalResidualRisk,
      totalRate,
      contractDuration
    );
    
    const totalFee = (data.equipmentFee || 0) + (data.servicesFee || 0) + (riskFee || 0);
    
    // Calculate amortization schedules
    const machineValue = data.machineValue || 0;
    const servicesPresentValue = data.servicesPresentValue || 0;
    const residualValue = data.residualValue || 0;
    
    const equipmentAmortization = calculateEquipmentAmortization(
      machineValue, 
      totalRate, 
      contractDuration,
      residualValue
    );
    
    const servicesAmortization = calculateServicesAmortization(
      servicesPresentValue,
      totalRate,
      contractDuration
    );
    
    const riskAmortization = calculateRiskAmortization(
      totalResidualRisk,
      totalRate,
      contractDuration
    );
    
    updateData({
      riskFee,
      totalFee,
      contractDuration,
      equipmentAmortization,
      servicesAmortization,
      riskAmortization
    });
    
  }, [data.totalResidualRisk, data.timeHorizon, data.contractDuration, data.totalRate, 
      data.equipmentFee, data.servicesFee, data.machineValue, data.servicesPresentValue, 
      data.residualValue, updateData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Equipment as a Service Quote Summary
        </h2>
        <p className="text-muted-foreground">
          Review the final quote details before completion
        </p>
      </div>
      
      <Tabs defaultValue="customer">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="fee">Fee Structure</TabsTrigger>
          <TabsTrigger value="calculations">Calculations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer">
          <CustomerTab data={data} />
        </TabsContent>
        
        <TabsContent value="equipment">
          <EquipmentTab data={data} />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialTab data={data} />
        </TabsContent>
        
        <TabsContent value="fee">
          <FeeStructureTab data={data} />
        </TabsContent>
        
        <TabsContent value="calculations">
          <CalculationsTab data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CustomerTab: React.FC<{ data: any }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Customer Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Customer Name</Label>
          <p className="font-medium">{data.customerName || "N/A"}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Contact Person</Label>
          <p className="font-medium">{data.contactPerson || "N/A"}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Time Horizon</Label>
          <p className="font-medium">{data.timeHorizon || 0} months</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Annual Usage</Label>
          <p className="font-medium">{data.intensityHours || 0} hours/year</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Daily Shifts</Label>
          <p className="font-medium">{data.dailyShifts || 1} shift(s)</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Setup Time</Label>
          <p className="font-medium">{data.setupTime || 0} hours</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EquipmentTab: React.FC<{ data: any }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Equipment & Services</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-4 border rounded-md bg-muted/50">
        <Label className="text-muted-foreground">Selected Machine</Label>
        <p className="font-medium">{data.machineName || "No machine selected"}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Value: ${data.machineValue?.toLocaleString() || "0"}
        </p>
        {data.residualValuePercentage > 0 && (
          <p className="text-sm text-muted-foreground">
            Residual Value: ${data.residualValue?.toLocaleString() || "0"} ({data.residualValuePercentage}%)
          </p>
        )}
      </div>
      
      <div>
        <Label className="text-muted-foreground">Selected Services</Label>
        {data.selectedServices && data.selectedServices.length > 0 ? (
          <div className="mt-2 space-y-4">
            <p className="font-medium">{data.selectedServices.length} service(s) selected</p>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2">Service Name</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-right p-2">Parts</th>
                    <th className="text-right p-2">Labor</th>
                    <th className="text-right p-2">Consumables</th>
                    <th className="text-right p-2">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.selectedServices.map((service: any) => {
                    const partsCost = service.parts_cost || 0;
                    const laborCost = service.labor_cost || 0;
                    const consumablesCost = service.consumables_cost || 0;
                    const totalCost = service.totalCost || partsCost + laborCost + consumablesCost;
                    
                    return (
                      <tr key={service.id} className="border-b">
                        <td className="p-2">{service.name}</td>
                        <td className="p-2">{service.category}</td>
                        <td className="p-2 text-right">${partsCost.toFixed(2)}</td>
                        <td className="p-2 text-right">${laborCost.toFixed(2)}</td>
                        <td className="p-2 text-right">${consumablesCost.toFixed(2)}</td>
                        <td className="p-2 text-right font-medium">${totalCost.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-sm">
              Services Present Value: ${data.servicesPresentValue?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-1">No services selected</p>
        )}
      </div>
      
      <div className="p-3 border rounded-md bg-primary/5">
        <div className="flex justify-between">
          <span>Primary Risk (PrimRsk):</span>
          <span className="font-semibold">${data.primaryRisk?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FinancialTab: React.FC<{ data: any }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Financial Parameters</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Contract Duration</Label>
          <p className="font-medium">{data.timeHorizon || data.contractDuration || 36} months</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Base Interest Rate</Label>
          <p className="font-medium">{data.baseRate || 5}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Credit Bureau Score</Label>
          <p className="font-medium">{data.creditBureau || "Not assessed"} / 10</p>
          <p className="text-sm text-muted-foreground">Spread: {data.bureauSpread?.toFixed(4) || 0}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Internal Rating</Label>
          <p className="font-medium">{data.internalRating || "Not assessed"} / 10</p>
          <p className="text-sm text-muted-foreground">Spread: {data.ratingSpread?.toFixed(4) || 0}</p>
        </div>
      </div>
      
      <div className="p-3 border rounded-md bg-primary/5">
        <div className="flex justify-between">
          <span>Total Interest Rate (InteTot):</span>
          <span className="font-semibold">{data.totalRate?.toFixed(2) || 0}%</span>
        </div>
      </div>
      
      <div className="p-3 border rounded-md bg-primary/5">
        <div className="flex justify-between">
          <span>Total Actualized Residual Risk:</span>
          <span className="font-semibold">${data.totalResidualRisk?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}</span>
        </div>
      </div>
      
      <div className="p-3 border rounded-md bg-muted/50">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-sm text-muted-foreground">Annual Usage Intensity</Label>
            <p className="font-medium">{data.intensityHours || 0} hours/year</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Daily Work Shifts</Label>
            <p className="font-medium">{data.dailyShifts || 1} shift(s)</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Average Setup Time</Label>
            <p className="font-medium">{data.setupTime || 0} hours</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FeeStructureTab: React.FC<{ data: any }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Fee Structure</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Equipment Fee (CanoBrkE):</span>
          <span className="font-medium">${data.equipmentFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
        </div>
        <div className="flex justify-between">
          <span>Services Fee (CanoBrkS):</span>
          <span className="font-medium">${data.servicesFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
        </div>
        <div className="flex justify-between">
          <span>Risk Fee (CanoRsk):</span>
          <span className="font-medium">${data.riskFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
        </div>
        
        <div className="h-px w-full bg-border my-2" />
        
        <div className="flex justify-between text-primary text-lg font-semibold">
          <span>Total Monthly Fee (CanoTot):</span>
          <span>${data.totalFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
        </div>
      </div>
      
      <div className="p-4 border rounded-md bg-muted/50">
        <Label className="text-muted-foreground">Contract Total</Label>
        <p className="font-medium text-xl">${(data.totalFee * (data.timeHorizon || data.contractDuration || 36)).toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}</p>
        <p className="text-sm text-muted-foreground mt-1">
          For the entire {data.timeHorizon || data.contractDuration || 36} month contract
        </p>
      </div>
    </CardContent>
  </Card>
);

// New tab for detailed calculations
const CalculationsTab: React.FC<{ data: any }> = ({ data }) => {
  const [activeTable, setActiveTable] = useState<'equipment' | 'services' | 'risk' | 'yearly'>('equipment');
  
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
                  <TableCell className="text-right">{data.timeHorizon || 0} months</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Annual Usage Intensity</TableCell>
                  <TableCell className="text-right">{data.intensityHours || 0} hours/year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Daily Work Shifts</TableCell>
                  <TableCell className="text-right">{data.dailyShifts || 1} shift(s)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Discount Rate</TableCell>
                  <TableCell className="text-right">{data.totalRate?.toFixed(2) || 0}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Present Value of Services</TableCell>
                  <TableCell className="text-right">${data.servicesPresentValue?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}</TableCell>
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
                  {data.serviceEvents && Array.from({ length: Math.min(10, Math.ceil((data.timeHorizon || 0) / 12)) }, (_, i) => i + 1).map((year) => {
                    const yearCosts = data.serviceEvents
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
            <TabsList className="w-full">
              <TabsTrigger 
                value="equipment" 
                className={activeTable === 'equipment' ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setActiveTable('equipment')}
              >
                Equipment
              </TabsTrigger>
              <TabsTrigger 
                value="services"
                className={activeTable === 'services' ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setActiveTable('services')}
              >
                Services
              </TabsTrigger>
              <TabsTrigger 
                value="risk"
                className={activeTable === 'risk' ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setActiveTable('risk')}
              >
                Risk
              </TabsTrigger>
            </TabsList>
          </div>
          
          {activeTable === 'equipment' && (
            <AmortizationTable 
              title="Equipment Amortization Schedule" 
              data={data.equipmentAmortization || []} 
              initialValue={data.machineValue || 0}
              residualValue={data.residualValue || 0}
            />
          )}
          
          {activeTable === 'services' && (
            <AmortizationTable 
              title="Services Amortization Schedule" 
              data={data.servicesAmortization || []} 
              initialValue={data.servicesPresentValue || 0}
              residualValue={0}
            />
          )}
          
          {activeTable === 'risk' && (
            <AmortizationTable 
              title="Risk Amortization Schedule" 
              data={data.riskAmortization || []} 
              initialValue={data.totalResidualRisk || 0}
              residualValue={0}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface AmortizationTableProps {
  title: string;
  data: any[];
  initialValue: number;
  residualValue: number;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ title, data, initialValue, residualValue }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Get current items
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
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
  );
};

export default SummaryStep;
