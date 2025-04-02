
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { calculatePeriodicFee } from "@/utils/calculations";
import { StepComponentProps } from "./types";

const SummaryStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  React.useEffect(() => {
    const totalResidualRisk = data.totalResidualRisk || 0;
    const contractDuration = data.contractDuration || 36;
    const totalRate = data.totalRate || 5;
    
    const riskFee = calculatePeriodicFee(
      totalResidualRisk,
      totalRate,
      contractDuration
    );
    
    const totalFee = (data.equipmentFee || 0) + (data.servicesFee || 0) + (riskFee || 0);
    
    updateData({
      riskFee,
      totalFee
    });
  }, [data.totalResidualRisk, data.contractDuration, data.totalRate, data.equipmentFee, data.servicesFee, updateData]);

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
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="fee">Fee Structure</TabsTrigger>
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
        {data.selectedServiceIds && data.selectedServiceIds.length > 0 ? (
          <div className="mt-2 space-y-2">
            <p className="font-medium">{data.selectedServiceIds.length} service(s) selected</p>
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
          <p className="font-medium">{data.contractDuration || 36} months</p>
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
        <p className="font-medium text-xl">${(data.totalFee * (data.contractDuration || 36)).toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}</p>
        <p className="text-sm text-muted-foreground mt-1">
          For the entire {data.contractDuration || 36} month contract
        </p>
      </div>
    </CardContent>
  </Card>
);

export default SummaryStep;
