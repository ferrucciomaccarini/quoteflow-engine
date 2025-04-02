
import React, { useState } from "react";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import RiskAssessment from "../RiskAssessment";
import { RiskData } from "@/types/database";
import { StepComponentProps } from "./types";
import { calculateResidualRisk } from "@/utils/calculations";

const RiskAssessmentStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const acquisitionValue = data.machineValue || 0;
  
  const riskData = React.useMemo(() => {
    if (data.riskData && data.riskData.riskVariables && data.riskData.riskVariables.length > 0) {
      return {...data.riskData, acquisitionValue};
    }
    
    const domains = ["Finance", "Usage", "Strategy", "Reputation"];
    const variableNames: {[key: string]: string[]} = {
      Finance: ["Installment Paid/Unpaid", "Forecasted Margin", "Final User Scoring Notch", "Final User Negative Act & Pledges"],
      Usage: ["Covenants", "Machinery Performance", "Maintenance Roadmap", "Installment Paid/Unpaid"],
      Strategy: ["CRM Planned Interactions", "Curves Convergence/Divergence", "Substitution Cost", "Mark-to-Market Reusable Materials"],
      Reputation: ["Final User Survey", "Maintainer Survey", "Carbon Footprint", "Power Consumption"]
    };
    
    let riskId = 1;
    
    const defaultRiskVariables = domains.flatMap(domain => {
      return Array.from({ length: 4 }, (_, i) => {
        const maxLossPercentage = Math.floor(Math.random() * 5) + 1; // Random between 1-5%
        return {
          id: `risk-${riskId++}`,
          domain: domain as "Finance" | "Usage" | "Strategy" | "Reputation",
          variable: variableNames[domain][i],
          frequency: 10 + Math.floor(Math.random() * 30), // Random between 10-40%
          maxLossPercentage,
          maxLoss: acquisitionValue * (maxLossPercentage / 100),
          mitigation: 50 + Math.floor(Math.random() * 30), // Random between 50-80%
          residualRisk: 0 // Will be recalculated
        };
      });
    });
    
    const calculatedRiskVariables = defaultRiskVariables.map(risk => ({
      ...risk,
      residualRisk: calculateResidualRisk(risk.maxLoss, risk.mitigation, risk.frequency)
    }));
    
    return {
      riskVariables: calculatedRiskVariables,
      avPercentage: 50,
      annualDiscountRate: data.baseRate || 5,
      contractYears: (data.contractDuration || 36) / 12,
      totalActualizedRisk: 0,
      machineId: data.selectedMachineId || '',
      acquisitionValue
    };
  }, [acquisitionValue, data.baseRate, data.contractDuration, data.machineValue, data.riskData, data.selectedMachineId]);

  const handleRiskAssessmentUpdate = (updatedData: Partial<RiskData>) => {
    if (updatedData.completed) {
      setIsConfirmed(true);
      updateData({
        riskData: updatedData,
        totalResidualRisk: updatedData.totalActualizedRisk || 0
      });
    } else {
      updateData({
        riskData: {...riskData, ...updatedData}
      });
    }
  };

  if (isConfirmed) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Risk Assessment Confirmed</AlertTitle>
          <AlertDescription className="text-green-700">
            Risk assessment completed with a Total Actualized Residual Risk of ${data.totalResidualRisk?.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0.00"}.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <Button 
            variant="outline"
            onClick={() => setIsConfirmed(false)}
          >
            Edit Risk Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Risk Assessment Required</AlertTitle>
        <AlertDescription>
          Please assess the risks for this quote and click "Confirm Risk Assessment" when done.
        </AlertDescription>
      </Alert>
      
      <RiskAssessment 
        data={riskData} 
        updateData={handleRiskAssessmentUpdate} 
        standalone={false}
      />
    </div>
  );
};

export default RiskAssessmentStep;
