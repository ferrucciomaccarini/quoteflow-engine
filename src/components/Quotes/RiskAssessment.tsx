
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateResidualRisk } from "@/utils/calculations";

interface RiskVariable {
  id: string;
  domain: "Finance" | "Usage" | "Strategy" | "Reputation";
  variable: string;
  frequency: number; // 0-100%
  maxLoss: number; // dollar amount
  mitigation: number; // 0-100%
  residualRisk: number; // calculated
}

interface RiskAssessmentProps {
  data: any;
  updateData: (data: any) => void;
}

const defaultRiskVariables: RiskVariable[] = [
  // Finance domain
  { id: "F1", domain: "Finance", variable: "Credit Risk", frequency: 20, maxLoss: 10000, mitigation: 60, residualRisk: 0 },
  { id: "F2", domain: "Finance", variable: "Currency Risk", frequency: 30, maxLoss: 5000, mitigation: 70, residualRisk: 0 },
  { id: "F3", domain: "Finance", variable: "Liquidity Risk", frequency: 15, maxLoss: 12000, mitigation: 65, residualRisk: 0 },
  { id: "F4", domain: "Finance", variable: "Market Risk", frequency: 25, maxLoss: 8000, mitigation: 55, residualRisk: 0 },
  
  // Usage domain
  { id: "U1", domain: "Usage", variable: "Operational Risk", frequency: 35, maxLoss: 15000, mitigation: 75, residualRisk: 0 },
  { id: "U2", domain: "Usage", variable: "Maintenance Risk", frequency: 40, maxLoss: 9000, mitigation: 80, residualRisk: 0 },
  { id: "U3", domain: "Usage", variable: "Performance Risk", frequency: 20, maxLoss: 7500, mitigation: 70, residualRisk: 0 },
  { id: "U4", domain: "Usage", variable: "Technology Risk", frequency: 15, maxLoss: 11000, mitigation: 60, residualRisk: 0 },
  
  // Strategy domain
  { id: "S1", domain: "Strategy", variable: "Regulatory Risk", frequency: 10, maxLoss: 20000, mitigation: 80, residualRisk: 0 },
  { id: "S2", domain: "Strategy", variable: "Competitive Risk", frequency: 25, maxLoss: 7500, mitigation: 50, residualRisk: 0 },
  { id: "S3", domain: "Strategy", variable: "Resource Risk", frequency: 20, maxLoss: 9000, mitigation: 65, residualRisk: 0 },
  { id: "S4", domain: "Strategy", variable: "Market Change Risk", frequency: 15, maxLoss: 8500, mitigation: 60, residualRisk: 0 },
  
  // Reputation domain
  { id: "R1", domain: "Reputation", variable: "Brand Risk", frequency: 10, maxLoss: 25000, mitigation: 70, residualRisk: 0 },
  { id: "R2", domain: "Reputation", variable: "Relationship Risk", frequency: 15, maxLoss: 12000, mitigation: 75, residualRisk: 0 },
  { id: "R3", domain: "Reputation", variable: "Compliance Risk", frequency: 20, maxLoss: 18000, mitigation: 85, residualRisk: 0 },
  { id: "R4", domain: "Reputation", variable: "Social Media Risk", frequency: 30, maxLoss: 15000, mitigation: 60, residualRisk: 0 },
];

// Pre-calculate residual risks
const initialRiskVariables = defaultRiskVariables.map(risk => ({
  ...risk,
  residualRisk: calculateResidualRisk(risk.maxLoss, risk.mitigation, risk.frequency)
}));

const RiskAssessment = ({ data, updateData }: RiskAssessmentProps) => {
  const [riskVariables, setRiskVariables] = useState<RiskVariable[]>(
    data.riskVariables || initialRiskVariables
  );

  const handleRiskVariableChange = (id: string, field: keyof RiskVariable, value: number) => {
    const updatedRiskVariables = riskVariables.map(risk => {
      if (risk.id === id) {
        const updatedRisk = { ...risk, [field]: value };
        
        // Recalculate residual risk if any of the input factors changes
        if (field === "frequency" || field === "maxLoss" || field === "mitigation") {
          updatedRisk.residualRisk = calculateResidualRisk(
            updatedRisk.maxLoss, 
            updatedRisk.mitigation, 
            updatedRisk.frequency
          );
        }
        
        return updatedRisk;
      }
      return risk;
    });
    
    setRiskVariables(updatedRiskVariables);
    updateData({ ...data, riskVariables: updatedRiskVariables });
  };

  const getTotalRiskByDomain = (domain: string): number => {
    return riskVariables
      .filter(risk => risk.domain === domain)
      .reduce((sum, risk) => sum + risk.residualRisk, 0);
  };

  const getTotalResidualRisk = (): number => {
    return riskVariables.reduce((sum, risk) => sum + risk.residualRisk, 0);
  };

  const renderRiskDomain = (domain: "Finance" | "Usage" | "Strategy" | "Reputation") => {
    const domainVariables = riskVariables.filter(risk => risk.domain === domain);
    
    return (
      <Card key={domain} className="mb-6">
        <CardHeader className="bg-muted">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>{domain} Domain</span>
            <span className="text-primary">
              Total: ${getTotalRiskByDomain(domain).toLocaleString(undefined, {maximumFractionDigits: 2})}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            {domainVariables.map(risk => (
              <div key={risk.id} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{risk.variable}</h4>
                  <span className="text-primary font-medium">
                    ${risk.residualRisk.toLocaleString(undefined, {maximumFractionDigits: 2})}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Probability (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[risk.frequency]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => handleRiskVariableChange(risk.id, "frequency", values[0])}
                        className="flex-grow"
                      />
                      <span className="w-10 text-right">{risk.frequency}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Max Loss ($)</Label>
                    <Input
                      type="number"
                      value={risk.maxLoss}
                      onChange={(e) => handleRiskVariableChange(risk.id, "maxLoss", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mitigation (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[risk.mitigation]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => handleRiskVariableChange(risk.id, "mitigation", values[0])}
                        className="flex-grow"
                      />
                      <span className="w-10 text-right">{risk.mitigation}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Risk Assessment</h2>
        <div className="text-xl font-semibold">
          Total Residual Risk: <span className="text-primary">${getTotalResidualRisk().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">
        Evaluate the 16 risk factors across the four risk domains according to the Paradigmix methodology.
      </p>
      
      {renderRiskDomain("Finance")}
      {renderRiskDomain("Usage")}
      {renderRiskDomain("Strategy")}
      {renderRiskDomain("Reputation")}
    </div>
  );
};

export default RiskAssessment;
