import { RiskVariable, RiskData, Machine } from './types';
import { calculateResidualRisk, calculateMaxLoss } from '@/utils/calculations';

export const getDefaultRiskVariables = (acquisitionValue: number, avPercentage: number): RiskVariable[] => {
  const maxLoss = calculateMaxLoss(acquisitionValue, avPercentage);
  
  const defaultRiskVariables: RiskVariable[] = [
    { 
      id: "F1", 
      domain: "Finance", 
      variable: "Installment Paid/Unpaid", 
      frequency: 20, 
      maxLoss: maxLoss * 0.05, 
      maxLossPercentage: 5,
      mitigation: 60, 
      residualRisk: 0 
    },
    { 
      id: "F2", 
      domain: "Finance", 
      variable: "Forecasted Margin", 
      frequency: 30, 
      maxLoss: maxLoss * 0.04, 
      maxLossPercentage: 4, 
      mitigation: 70, 
      residualRisk: 0 
    },
    { 
      id: "F3", 
      domain: "Finance", 
      variable: "Final User Scoring Notch", 
      frequency: 15, 
      maxLoss: maxLoss * 0.03, 
      maxLossPercentage: 3, 
      mitigation: 65, 
      residualRisk: 0 
    },
    { 
      id: "F4", 
      domain: "Finance", 
      variable: "Final User Negative Act & Pledges", 
      frequency: 25, 
      maxLoss: maxLoss * 0.02, 
      maxLossPercentage: 2, 
      mitigation: 55, 
      residualRisk: 0 
    },
    
    { 
      id: "U1", 
      domain: "Usage", 
      variable: "Covenants", 
      frequency: 35, 
      maxLoss: maxLoss * 0.05, 
      maxLossPercentage: 5,
      mitigation: 75, 
      residualRisk: 0 
    },
    { 
      id: "U2", 
      domain: "Usage", 
      variable: "Machinery Performance", 
      frequency: 40, 
      maxLoss: maxLoss * 0.03, 
      maxLossPercentage: 3,
      mitigation: 80, 
      residualRisk: 0 
    },
    { 
      id: "U3", 
      domain: "Usage", 
      variable: "Maintenance Roadmap", 
      frequency: 20, 
      maxLoss: maxLoss * 0.04, 
      maxLossPercentage: 4,
      mitigation: 70, 
      residualRisk: 0 
    },
    { 
      id: "U4", 
      domain: "Usage", 
      variable: "Expected Downtime", 
      frequency: 15, 
      maxLoss: maxLoss * 0.03, 
      maxLossPercentage: 3,
      mitigation: 60, 
      residualRisk: 0 
    },
    
    { 
      id: "S1", 
      domain: "Strategy", 
      variable: "CRM Planned Interactions", 
      frequency: 10, 
      maxLoss: maxLoss * 0.02, 
      maxLossPercentage: 2,
      mitigation: 80, 
      residualRisk: 0 
    },
    { 
      id: "S2", 
      domain: "Strategy", 
      variable: "Curves Convergence/Divergence", 
      frequency: 25, 
      maxLoss: maxLoss * 0.03, 
      maxLossPercentage: 3,
      mitigation: 50, 
      residualRisk: 0 
    },
    { 
      id: "S3", 
      domain: "Strategy", 
      variable: "Substitution Cost", 
      frequency: 20, 
      maxLoss: maxLoss * 0.04, 
      maxLossPercentage: 4,
      mitigation: 65, 
      residualRisk: 0 
    },
    { 
      id: "S4", 
      domain: "Strategy", 
      variable: "Mark-to-Market Reusable Materials", 
      frequency: 15, 
      maxLoss: maxLoss * 0.03, 
      maxLossPercentage: 3,
      mitigation: 60, 
      residualRisk: 0 
    },
    
    { 
      id: "R1", 
      domain: "Reputation", 
      variable: "Final User Survey", 
      frequency: 10, 
      maxLoss: maxLoss * 0.02, 
      maxLossPercentage: 2,
      mitigation: 70, 
      residualRisk: 0 
    },
    { 
      id: "R2", 
      domain: "Reputation", 
      variable: "Maintainer Survey", 
      frequency: 15, 
      maxLoss: maxLoss * 0.03, 
      maxLossPercentage: 3,
      mitigation: 75, 
      residualRisk: 0 
    },
    { 
      id: "R3", 
      domain: "Reputation", 
      variable: "Carbon Footprint", 
      frequency: 20, 
      maxLoss: maxLoss * 0.02, 
      maxLossPercentage: 2,
      mitigation: 85, 
      residualRisk: 0 
    },
    { 
      id: "R4", 
      domain: "Reputation", 
      variable: "Power Consumption", 
      frequency: 30, 
      maxLoss: maxLoss * 0.04, 
      maxLossPercentage: 4,
      mitigation: 60, 
      residualRisk: 0 
    },
  ];
  
  return defaultRiskVariables.map(risk => ({
    ...risk,
    residualRisk: calculateResidualRisk(risk.maxLoss, risk.mitigation, risk.frequency)
  }));
};

export const updateRiskData = (prev: RiskData, newData: Partial<RiskData>, selectedMachine: Machine | null): RiskData => {
  const updated = { ...prev, ...newData };
  
  if (
    newData.riskVariables || 
    newData.annualDiscountRate !== undefined || 
    newData.contractYears !== undefined
  ) {
    const risksByDomain = updated.riskVariables.reduce((domains: { [key: string]: number[] }, risk) => {
      if (!domains[risk.domain]) domains[risk.domain] = [];
      domains[risk.domain].push(risk.residualRisk);
      return domains;
    }, {});
    
    updated.totalActualizedRisk = calculateActualizedTotalRisk(
      risksByDomain,
      updated.annualDiscountRate,
      updated.contractYears
    );
  }
  
  if (newData.avPercentage !== undefined && selectedMachine) {
    const maxLoss = calculateMaxLoss(selectedMachine.acquisition_value, newData.avPercentage);
    
    updated.riskVariables = updated.riskVariables.map(risk => {
      const updatedMaxLoss = (selectedMachine.acquisition_value) * (risk.maxLossPercentage / 100);
      
      const updatedRisk = { 
        ...risk, 
        maxLoss: updatedMaxLoss 
      };
      
      updatedRisk.residualRisk = calculateResidualRisk(
        updatedRisk.maxLoss, 
        updatedRisk.mitigation, 
        updatedRisk.frequency
      );
      
      return updatedRisk;
    });
    
    const risksByDomain = updated.riskVariables.reduce((domains: { [key: string]: number[] }, risk) => {
      if (!domains[risk.domain]) domains[risk.domain] = [];
      domains[risk.domain].push(risk.residualRisk);
      return domains;
    }, {});
    
    updated.totalActualizedRisk = calculateActualizedTotalRisk(
      risksByDomain,
      updated.annualDiscountRate,
      updated.contractYears
    );
  }
  
  return updated;
};

const calculateActualizedTotalRisk = (
  risksByDomain: { [key: string]: number[] },
  annualDiscountRate: number,
  contractYears: number
): number => {
  const yearlyRate = annualDiscountRate / 100;
  
  const allRisks = Object.values(risksByDomain).flat();
  
  let totalRisk = 0;
  
  allRisks.forEach(risk => {
    for (let year = 1; year <= contractYears; year++) {
      const presentValue = risk / Math.pow(1 + yearlyRate, year);
      totalRisk += presentValue;
    }
  });
  
  return totalRisk;
};
