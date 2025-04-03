
export interface RiskVariable {
  id: string;
  domain: "Finance" | "Usage" | "Strategy" | "Reputation";
  variable: string;
  frequency: number; // 0-100%
  maxLossPercentage: number; // 0-100% of acquisition value
  maxLoss: number; // dollar amount
  mitigation: number; // 0-100%
  residualRisk: number; // calculated
}

export interface Machine {
  id: string;
  name: string;
  acquisition_value: number;
}

export interface RiskData {
  riskVariables: RiskVariable[];
  avPercentage: number;
  annualDiscountRate: number;
  contractYears: number;
  totalActualizedRisk: number;
  machineId: string;
  acquisitionValue?: number;
  completed?: boolean;
  [key: string]: any;
}
