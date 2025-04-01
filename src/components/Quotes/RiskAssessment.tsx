
import React from "react";
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

interface RiskData {
  riskVariables: RiskVariable[];
  avPercentage: number;
  annualDiscountRate: number;
  contractYears: number;
  totalActualizedRisk: number;
  [key: string]: any;
}

interface RiskAssessmentProps {
  data: RiskData;
  updateData: (data: Partial<RiskData>) => void;
}

const RiskAssessment = ({ data, updateData }: RiskAssessmentProps) => {
  const handleRiskVariableChange = (id: string, field: keyof RiskVariable, value: number) => {
    const updatedRiskVariables = data.riskVariables.map(risk => {
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
    
    updateData({ riskVariables: updatedRiskVariables });
  };

  const getTotalRiskByDomain = (domain: string): number => {
    return data.riskVariables
      .filter(risk => risk.domain === domain)
      .reduce((sum, risk) => sum + risk.residualRisk, 0);
  };

  const getTotalResidualRisk = (): number => {
    return data.riskVariables.reduce((sum, risk) => sum + risk.residualRisk, 0);
  };

  const renderRiskDomain = (domain: "Finance" | "Usage" | "Strategy" | "Reputation") => {
    const domainVariables = data.riskVariables.filter(risk => risk.domain === domain);
    
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
                      disabled // Max loss is now calculated based on acquisition value
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
        <h2 className="text-2xl font-bold">Annual Risk Assessment</h2>
        <div className="text-xl font-semibold">
          Annual Risk: <span className="text-primary">${getTotalResidualRisk().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
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
