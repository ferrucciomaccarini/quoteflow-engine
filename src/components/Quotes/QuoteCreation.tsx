import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import StepWizard from "../common/StepWizard";
import RiskAssessment from "./RiskAssessment";
import { calculatePeriodicFee, calculatePresentValue, calculateServiceEvents, calculateServicePresentValue } from "@/utils/calculations";
import { saveQuote } from "@/utils/quoteService";
import { useAuth } from "@/context/AuthContext";

const CustomerNeedsStep = ({ data, updateData }: any) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input 
            id="customerName"
            value={data.customerName || ""}
            onChange={(e) => updateData({ customerName: e.target.value })}
            placeholder="Enter customer name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input 
            id="contactPerson"
            value={data.contactPerson || ""}
            onChange={(e) => updateData({ contactPerson: e.target.value })}
            placeholder="Enter contact person"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeHorizon">Time Horizon (months)</Label>
          <Input 
            id="timeHorizon"
            type="number"
            value={data.timeHorizon || ""}
            onChange={(e) => updateData({ timeHorizon: parseInt(e.target.value) || 0 })}
            placeholder="Enter time horizon"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="intensityHours">Annual Usage Intensity (hours)</Label>
          <Input 
            id="intensityHours"
            type="number"
            value={data.intensityHours || ""}
            onChange={(e) => updateData({ intensityHours: parseInt(e.target.value) || 0 })}
            placeholder="Enter annual usage hours"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyShifts">Daily Work Shifts</Label>
          <Select 
            value={data.dailyShifts?.toString() || ""} 
            onValueChange={(value) => updateData({ dailyShifts: parseInt(value) || 1 })}
          >
            <SelectTrigger id="dailyShifts">
              <SelectValue placeholder="Select shifts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Shift (8 hours)</SelectItem>
              <SelectItem value="2">2 Shifts (16 hours)</SelectItem>
              <SelectItem value="3">3 Shifts (24 hours)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="setupTime">Average Setup Time (hours)</Label>
          <Input 
            id="setupTime"
            type="number"
            value={data.setupTime || ""}
            onChange={(e) => updateData({ setupTime: parseFloat(e.target.value) || 0 })}
            placeholder="Enter average setup time"
          />
        </div>
      </div>
    </div>
  );
};

const EquipmentSelectionStep = ({ data, updateData }: any) => {
  const [machines] = useState([
    {
      id: "M1001",
      name: "Industrial Press XL-5000",
      category: "Pressing Equipment",
      acquisitionValue: 85000,
    },
    {
      id: "M1002",
      name: "Robotic Arm System R-200",
      category: "Robotics",
      acquisitionValue: 125000,
    },
    {
      id: "M1003",
      name: "CNC Machine T-3000",
      category: "CNC Equipment",
      acquisitionValue: 95000,
    },
  ]);

  const selectedMachine = machines.find(m => m.id === data.selectedMachineId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="selectedMachineId">Select Equipment</Label>
        <Select 
          value={data.selectedMachineId || ""} 
          onValueChange={(value) => {
            const machine = machines.find(m => m.id === value);
            updateData({ 
              selectedMachineId: value,
              machineName: machine?.name,
              machineValue: machine?.acquisitionValue || 0
            });
          }}
        >
          <SelectTrigger id="selectedMachineId">
            <SelectValue placeholder="Select machinery" />
          </SelectTrigger>
          <SelectContent>
            {machines.map(machine => (
              <SelectItem key={machine.id} value={machine.id}>
                {machine.name} - ${machine.acquisitionValue.toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMachine && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle>{selectedMachine.name}</CardTitle>
            <CardDescription>Category: {selectedMachine.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>Acquisition Value:</span>
              <span className="font-medium">${selectedMachine.acquisitionValue.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ServiceSelectionStep = ({ data, updateData }: any) => {
  const [services] = useState([
    {
      id: "S1001",
      name: "Preventive Maintenance - Basic",
      category: "Maintenance",
      partsCost: 350,
      laborCost: 250,
      consumablesCost: 100,
      intervalType: "hours",
      intervalValue: 500,
    },
    {
      id: "S1002",
      name: "Preventive Maintenance - Advanced",
      category: "Maintenance",
      partsCost: 750,
      laborCost: 500,
      consumablesCost: 250,
      intervalType: "months",
      intervalValue: 3,
    },
    {
      id: "S1003",
      name: "Equipment Insurance - Standard",
      category: "Insurance",
      partsCost: 0,
      laborCost: 0,
      consumablesCost: 0,
      intervalType: "months",
      intervalValue: 1,
      fixedCost: 350,
    },
  ]);

  const selectedServices = data.selectedServiceIds || [];
  
  const toggleService = (serviceId: string) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    const selectedServiceObjects = services.filter(s => updatedServices.includes(s.id));
    const timeHorizon = data.timeHorizon || 36;
    const intensityHours = data.intensityHours || 2000;
    
    let totalServiceCost = 0;
    const allServiceEvents = [];
    
    for (const service of selectedServiceObjects) {
      let serviceCost = 0;
      
      if (service.category === "Insurance") {
        serviceCost = (service.fixedCost || 0) * timeHorizon;
      } else {
        const serviceIntervalHours = service.intervalType === "hours" ? service.intervalValue : null;
        const serviceIntervalMonths = service.intervalType === "months" ? service.intervalValue : null;
        
        const events = calculateServiceEvents(
          intensityHours,
          timeHorizon / 12,
          serviceIntervalHours || 0,
          serviceIntervalMonths,
          service.partsCost,
          service.laborCost,
          service.consumablesCost
        );
        
        allServiceEvents.push(...events);
        
        events.forEach(event => {
          serviceCost += event.cost;
        });
      }
      
      totalServiceCost += serviceCost;
    }
    
    const baseRate = data.baseRate || 5;
    const servicesPresentValue = allServiceEvents.length > 0 
      ? calculateServicePresentValue(allServiceEvents, baseRate) 
      : totalServiceCost;
    
    updateData({ 
      selectedServiceIds: updatedServices,
      serviceEvents: allServiceEvents,
      totalServiceCost,
      servicesPresentValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {services.map(service => (
          <Card 
            key={service.id} 
            className={`transition-colors ${
              selectedServices.includes(service.id) 
                ? "border-primary border-2" 
                : "border-border"
            }`}
          >
            <CardHeader className="pb-2 flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>Category: {service.category}</CardDescription>
              </div>
              <Button
                variant={selectedServices.includes(service.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleService(service.id)}
              >
                {selectedServices.includes(service.id) ? "Selected" : "Select"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {service.category === "Maintenance" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Parts Cost:</span>
                      <span>${service.partsCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Labor Cost:</span>
                      <span>${service.laborCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Consumables Cost:</span>
                      <span>${service.consumablesCost}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Interval:</span>
                      <span>
                        Every {service.intervalValue} {service.intervalType}
                      </span>
                    </div>
                  </>
                )}
                
                {service.category === "Insurance" && (
                  <div className="flex justify-between text-sm font-medium">
                    <span>Monthly Cost:</span>
                    <span>${service.fixedCost}/month</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle>Selected Services Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Number of Services:</span>
                <span className="font-medium">{selectedServices.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Service Cost:</span>
                <span className="font-medium">
                  ${data.totalServiceCost ? data.totalServiceCost.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Present Value of Services:</span>
                <span className="font-medium">
                  ${data.servicesPresentValue ? data.servicesPresentValue.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const FinancialParametersStep = ({ data, updateData }: any) => {
  const machineValue = data.machineValue || 0;
  const servicesPresentValue = data.servicesPresentValue || 0;
  const primaryRisk = machineValue + servicesPresentValue;
  
  React.useEffect(() => {
    updateData({ primaryRisk });
  }, [machineValue, servicesPresentValue, primaryRisk, updateData]);
  
  React.useEffect(() => {
    const contractDuration = data.contractDuration || 36;
    const baseRate = data.baseRate || 5;
    const bureauSpread = data.bureauSpread || 1;
    const ratingSpread = data.ratingSpread || 0.5;
    const totalRate = baseRate + bureauSpread + ratingSpread;
    
    const equipmentFee = calculatePeriodicFee(
      machineValue,
      totalRate,
      contractDuration
    );
    
    const servicesFee = calculatePeriodicFee(
      servicesPresentValue,
      totalRate,
      contractDuration
    );
    
    const totalFeeBeforeRisks = equipmentFee + servicesFee;
    
    updateData({
      totalRate,
      equipmentFee,
      servicesFee,
      totalFeeBeforeRisks
    });
  }, [
    data.contractDuration,
    data.baseRate,
    data.bureauSpread,
    data.ratingSpread,
    machineValue,
    servicesPresentValue,
    updateData
  ]);

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle>Primary Risk Overview</CardTitle>
          <CardDescription>
            The sum of machinery value and services forms the primary risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Machinery Value (ImpoEqu):</span>
              <span className="font-medium">${machineValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between">
              <span>Services Value (ImpoSer):</span>
              <span className="font-medium">${servicesPresentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-primary font-semibold">
              <span>Primary Risk (PrimRsk):</span>
              <span>${primaryRisk.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Credit Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="creditBureau">Credit Bureau Score (1-10)</Label>
              <Input 
                id="creditBureau"
                type="number"
                min="1"
                max="10"
                value={data.creditBureau || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 10) {
                    const bureauSpread = (11 - value) * 0.2;
                    updateData({ creditBureau: value, bureauSpread });
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internalRating">Internal Rating (1-10)</Label>
              <Input 
                id="internalRating"
                type="number"
                min="1"
                max="10"
                value={data.internalRating || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 10) {
                    const ratingSpread = (11 - value) * 0.1;
                    updateData({ internalRating: value, ratingSpread });
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contract Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractDuration">Contract Duration (months)</Label>
              <Input 
                id="contractDuration"
                type="number"
                min="1"
                value={data.contractDuration || "36"}
                onChange={(e) => updateData({ contractDuration: parseInt(e.target.value) || 36 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseRate">Base Interest Rate (%)</Label>
              <Input 
                id="baseRate"
                type="number"
                step="0.1"
                min="0"
                value={data.baseRate || "5"}
                onChange={(e) => updateData({ baseRate: parseFloat(e.target.value) || 5 })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Fee Calculation (Before Risks)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>Base Rate (InteBase)</Label>
              <div className="text-lg font-semibold">{data.baseRate || 5}%</div>
            </div>
            <div className="space-y-1">
              <Label>Bureau Spread (SprdBure)</Label>
              <div className="text-lg font-semibold">{data.bureauSpread?.toFixed(2) || 0}%</div>
            </div>
            <div className="space-y-1">
              <Label>Rating Spread (SprdRati)</Label>
              <div className="text-lg font-semibold">{data.ratingSpread?.toFixed(2) || 0}%</div>
            </div>
            <div className="space-y-1">
              <Label>Total Rate (InteTot)</Label>
              <div className="text-lg font-semibold text-primary">{data.totalRate?.toFixed(2) || 0}%</div>
            </div>
          </div>
          
          <div className="h-px w-full bg-border my-2" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Equipment Fee (CanoBrkE):</span>
              <span>${data.equipmentFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Services Fee (CanoBrkS):</span>
              <span>${data.servicesFee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Fee Before Risks (CanoBrkA):</span>
              <span className="text-primary">${data.totalFeeBeforeRisks?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}/month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SummaryStep = ({ data, updateData }: any) => {
  React.useEffect(() => {
    if (data.riskVariables) {
      const totalResidualRisk = data.riskVariables.reduce((sum: number, risk: any) => sum + risk.residualRisk, 0);
      const contractDuration = data.contractDuration || 36;
      const totalRate = data.totalRate || 5;
      
      const riskFee = calculatePeriodicFee(
        totalResidualRisk,
        totalRate,
        contractDuration
      );
      
      const totalFee = (data.equipmentFee || 0) + (data.servicesFee || 0) + (riskFee || 0);
      
      updateData({
        totalResidualRisk,
        riskFee,
        totalFee
      });
    }
  }, [data.riskVariables, data.contractDuration, data.totalRate, data.equipmentFee, data.servicesFee, updateData]);

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
        </TabsContent>
        
        <TabsContent value="equipment">
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
        </TabsContent>
        
        <TabsContent value="financial">
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
                  <p className="text-sm text-muted-foreground">Spread: {data.bureauSpread?.toFixed(2) || 0}%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Internal Rating</Label>
                  <p className="font-medium">{data.internalRating || "Not assessed"} / 10</p>
                  <p className="text-sm text-muted-foreground">Spread: {data.ratingSpread?.toFixed(2) || 0}%</p>
                </div>
              </div>
              
              <div className="p-3 border rounded-md bg-primary/5">
                <div className="flex justify-between">
                  <span>Total Interest Rate (InteTot):</span>
                  <span className="font-semibold">{data.totalRate?.toFixed(2) || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fee">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

const QuoteCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const handleComplete = async (data: any) => {
    console.log("Quote completed:", data);
    
    try {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save quotes.",
          variant: "destructive",
        });
        return;
      }
      
      const quoteData = {
        ...data,
        totalFee: data.totalFee || data.totalFeeBeforeRisks || 0, 
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      
      console.log("Saving quote with data:", quoteData);
      
      await saveQuote(quoteData);
      
      toast({
        title: "Quote Created",
        description: "Your EaaS quote has been successfully created and stored.",
      });
      
      navigate("/quotes");
    } catch (error) {
      console.error("Failed to save quote:", error);
      toast({
        title: "Error",
        description: "Failed to save the quote. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const steps = [
    {
      id: "customer-needs",
      title: "Customer Needs",
      description: "Define the customer's business requirements",
      content: <CustomerNeedsStep />
    },
    {
      id: "equipment-selection",
      title: "Equipment Selection",
      description: "Select the appropriate machinery",
      content: <EquipmentSelectionStep />
    },
    {
      id: "service-selection",
      title: "Service Selection",
      description: "Select the services to include",
      content: <ServiceSelectionStep />
    },
    {
      id: "financial-parameters",
      title: "Financial Parameters",
      description: "Define the financial parameters of the contract",
      content: <FinancialParametersStep />
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Evaluate risks according to Paradigmix methodology",
      content: <RiskAssessment 
        data={{
          riskVariables: [],
          avPercentage: 50,
          annualDiscountRate: 5,
          contractYears: 3,
          totalActualizedRisk: 0
        }} 
        updateData={() => {}} 
      />
    },
    {
      id: "summary",
      title: "Summary",
      description: "Review the final EaaS fee structure",
      content: <SummaryStep />
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Quote</h1>
        <p className="text-gray-600">
          Follow the step-by-step process to create an Equipment as a Service (EaaS) quote
        </p>
      </div>
      
      <StepWizard
        steps={steps}
        onComplete={handleComplete}
        initialData={{
          timeHorizon: 36,
          intensityHours: 2000,
          dailyShifts: 1,
          setupTime: 1,
          contractDuration: 36,
          baseRate: 5,
          bureauSpread: 1,
          ratingSpread: 0.5,
          totalRate: 6.5
        }}
      />
    </div>
  );
};

export default QuoteCreation;
