
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculateResidualRisk } from "@/utils/calculations";
import { RiskData, RiskVariable } from "./RiskAssessment/types";

interface RiskAssessmentProps {
  data: RiskData;
  updateData: (data: Partial<RiskData>) => void;
  standalone?: boolean;
}

const RiskAssessment = ({ data, updateData, standalone = true }: RiskAssessmentProps) => {
  // Make sure data.riskVariables exists, if not initialize it
  React.useEffect(() => {
    if (!data.riskVariables) {
      // Initialize with empty array if undefined
      updateData({ 
        riskVariables: [] 
      });
    }
  }, [data, updateData]);

  const handleRiskVariableChange = (id: string, field: keyof RiskVariable, value: number) => {
    // Make sure data.riskVariables exists before attempting to map over it
    if (!data.riskVariables) return;
    
    const updatedRiskVariables = data.riskVariables.map(risk => {
      if (risk.id === id) {
        const updatedRisk = { ...risk, [field]: value };
        
        // If maxLossPercentage is changed, update maxLoss based on acquisition value
        if (field === "maxLossPercentage") {
          updatedRisk.maxLoss = (data.acquisitionValue || 0) * (value / 100);
        }
        
        // Recalculate residual risk if any of the input factors changes
        if (field === "frequency" || field === "maxLoss" || field === "mitigation" || field === "maxLossPercentage") {
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
    // Make sure data.riskVariables exists before filtering and reducing
    if (!data.riskVariables || !Array.isArray(data.riskVariables)) {
      return 0;
    }
    
    return data.riskVariables
      .filter(risk => risk.domain === domain)
      .reduce((sum, risk) => sum + risk.residualRisk, 0);
  };

  const getTotalResidualRisk = (): number => {
    // Make sure data.riskVariables exists before reducing
    if (!data.riskVariables || !Array.isArray(data.riskVariables)) {
      return 0;
    }
    
    return data.riskVariables.reduce((sum, risk) => sum + risk.residualRisk, 0);
  };

  const renderRiskDomain = (domain: "Finance" | "Usage" | "Strategy" | "Reputation") => {
    // Make sure data.riskVariables exists before filtering
    if (!data.riskVariables || !Array.isArray(data.riskVariables)) {
      return null;
    }
    
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
                    <Label>Max Loss (%)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[risk.maxLossPercentage || 1]}
                        min={0.1}
                        max={10}
                        step={0.1}
                        onValueChange={(values) => handleRiskVariableChange(risk.id, "maxLossPercentage", values[0])}
                        className="flex-grow"
                      />
                      <span className="w-12 text-right">{risk.maxLossPercentage?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${risk.maxLoss.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
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

  // If data.riskVariables is undefined or empty, show a placeholder message
  if (!data.riskVariables || data.riskVariables.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Annual Risk Assessment</h2>
          <div className="text-xl font-semibold">
            Annual Risk: <span className="text-primary">$0.00</span>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Evaluate the risk factors across the four risk domains according to the Paradigmix methodology.
        </p>
        
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">
              No risk variables have been defined yet. Please initialize the risk assessment data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      {!standalone && (
        <div className="flex justify-end">
          <Button 
            variant="default" 
            onClick={() => {
              // This button is shown only in the quote creation flow
              // and is intended to pass the risk assessment value back to the parent
              if (updateData && typeof updateData === 'function') {
                updateData({
                  totalActualizedRisk: getTotalResidualRisk(),
                  completed: true
                });
              }
            }}
          >
            Confirm Risk Assessment
          </Button>
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
