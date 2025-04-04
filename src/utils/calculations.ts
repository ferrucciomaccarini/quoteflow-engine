
// Calculate periodic fee (French method - Equal installments)
export const calculatePeriodicFee = (
  principal: number,
  interestRate: number,
  periods: number,
  residualValue: number = 0
): number => {
  // Convert annual interest rate to per-period rate
  const periodicRate = interestRate / 100 / 12;
  
  // If interest rate is zero, simply divide principal by periods
  if (periodicRate === 0) return (principal - residualValue) / periods;
  
  // French method formula with residual value:
  // PMT = [P * r(1+r)^n - RV * r] / [(1+r)^n - 1]
  // where:
  // P = principal
  // r = periodic rate
  // n = number of periods
  // RV = residual value
  
  const principalComponent = principal * periodicRate * Math.pow(1 + periodicRate, periods);
  const residualComponent = residualValue * periodicRate;
  const denominator = Math.pow(1 + periodicRate, periods) - 1;
  
  return (principalComponent - residualComponent) / denominator;
};

// Calculate present value of a future cash flow
export const calculatePresentValue = (
  futureValue: number,
  discountRate: number,
  periods: number
): number => {
  // Convert annual discount rate to per-period rate
  const periodicRate = discountRate / 100 / 12;
  
  // Present value formula: PV = FV / (1 + r)^n
  return futureValue / Math.pow(1 + periodicRate, periods);
};

// Calculate residual risk
export const calculateResidualRisk = (
  maxLoss: number,
  mitigationFactor: number,
  frequency: number
): number => {
  // RiskResi = RiskMaxL * RiskMiti * RiskFreq
  return maxLoss * (mitigationFactor / 100) * (frequency / 100);
};

// Calculate max loss based on acquisition value and percentage
export const calculateMaxLoss = (
  acquisitionValue: number,
  avPercentage: number
): number => {
  return acquisitionValue * (avPercentage / 100);
};

// Calculate actualized total residual risk
export const calculateActualizedTotalRisk = (
  risksByDomain: { [key: string]: number[] },
  annualDiscountRate: number,
  contractYears: number
): number => {
  // Annual discount rate to periodic rate (divide by 12 for monthly)
  const yearlyRate = annualDiscountRate / 100;
  
  // Get all individual risk values into one array
  const allRisks = Object.values(risksByDomain).flat();
  
  // Calculate the present value of each risk for each year
  let totalRisk = 0;
  
  // For each risk, calculate its present value for each year of the contract
  allRisks.forEach(risk => {
    for (let year = 1; year <= contractYears; year++) {
      const presentValue = risk / Math.pow(1 + yearlyRate, year);
      totalRisk += presentValue;
    }
  });
  
  return totalRisk;
};

// Calculate events for maintenance services
export interface ServiceEvent {
  month: number;
  cost: number;
  description: string;
}

export const calculateServiceEvents = (
  hoursPerYear: number,
  contractDuration: number, // in years
  serviceIntervalHours: number,
  serviceIntervalMonths: number | null,
  partsCost: number,
  laborCost: number,
  consumablesCost: number
): ServiceEvent[] => {
  const events: ServiceEvent[] = [];
  const totalMonths = contractDuration * 12;
  const hoursPerMonth = hoursPerYear / 12;
  
  // Events based on usage hours
  if (serviceIntervalHours) {
    let accumulatedHours = 0;
    let month = 0;
    
    while (month < totalMonths) {
      accumulatedHours += hoursPerMonth;
      month++;
      
      if (accumulatedHours >= serviceIntervalHours) {
        events.push({
          month,
          cost: partsCost + laborCost + consumablesCost,
          description: `Maintenance at ${serviceIntervalHours} hours`
        });
        
        accumulatedHours = 0; // Reset accumulated hours
      }
    }
  }
  
  // Events based on fixed time intervals
  if (serviceIntervalMonths) {
    let month = serviceIntervalMonths;
    
    while (month <= totalMonths) {
      events.push({
        month,
        cost: partsCost + laborCost + consumablesCost,
        description: `Scheduled maintenance (${serviceIntervalMonths} month interval)`
      });
      
      month += serviceIntervalMonths;
    }
  }
  
  // Sort events by month
  return events.sort((a, b) => a.month - b.month);
};

// Calculate total present value of service costs
export const calculateServicePresentValue = (
  serviceEvents: ServiceEvent[],
  discountRate: number
): number => {
  return serviceEvents.reduce((total, event) => {
    return total + calculatePresentValue(event.cost, discountRate, event.month);
  }, 0);
};

// Calculate residual value based on acquisition value and percentage
export const calculateResidualValue = (
  acquisitionValue: number,
  residualValuePercentage: number
): number => {
  return acquisitionValue * (residualValuePercentage / 100);
};

// NEW FUNCTIONS: Calculate yearly service costs
export const calculateYearlyServiceCosts = (
  serviceEvents: ServiceEvent[],
  contractYears: number
): number[] => {
  const yearlyCosts = Array(10).fill(0); // Initialize with 10 years (max)
  
  serviceEvents.forEach(event => {
    const year = Math.floor((event.month - 1) / 12);
    if (year < 10) {
      yearlyCosts[year] += event.cost;
    }
  });
  
  return yearlyCosts;
};

// NEW FUNCTION: Calculate detailed amortization schedule for equipment
export interface AmortizationEntry {
  month: number;
  remainingCapital: number;
  capitalPortion: number;
  interestPortion: number;
  fee: number;
}

export const calculateEquipmentAmortization = (
  acquisitionValue: number,
  interestRate: number,
  periods: number,
  residualValue: number = 0
): AmortizationEntry[] => {
  const amortizationTable: AmortizationEntry[] = [];
  const periodicRate = interestRate / 100 / 12;
  const monthlyFee = calculatePeriodicFee(acquisitionValue, interestRate, periods, residualValue);
  
  let remainingCapital = acquisitionValue;
  
  for (let month = 1; month <= periods; month++) {
    const interestPortion = remainingCapital * periodicRate;
    let capitalPortion = monthlyFee - interestPortion;
    
    // Adjust for the last period to ensure the final value equals the residual value
    if (month === periods) {
      capitalPortion = remainingCapital - residualValue;
      remainingCapital = residualValue;
    } else {
      remainingCapital -= capitalPortion;
    }
    
    amortizationTable.push({
      month,
      remainingCapital,
      capitalPortion,
      interestPortion,
      fee: capitalPortion + interestPortion
    });
  }
  
  return amortizationTable;
};

// NEW FUNCTION: Calculate detailed amortization schedule for services
export const calculateServicesAmortization = (
  servicesPresentValue: number,
  interestRate: number,
  periods: number
): AmortizationEntry[] => {
  const amortizationTable: AmortizationEntry[] = [];
  const periodicRate = interestRate / 100 / 12;
  const monthlyFee = calculatePeriodicFee(servicesPresentValue, interestRate, periods);
  
  let remainingCapital = servicesPresentValue;
  
  for (let month = 1; month <= periods; month++) {
    const interestPortion = remainingCapital * periodicRate;
    let capitalPortion = monthlyFee - interestPortion;
    
    // Adjust for the last period to ensure we reach zero
    if (month === periods) {
      capitalPortion = remainingCapital;
      remainingCapital = 0;
    } else {
      remainingCapital -= capitalPortion;
    }
    
    amortizationTable.push({
      month,
      remainingCapital,
      capitalPortion,
      interestPortion,
      fee: capitalPortion + interestPortion
    });
  }
  
  return amortizationTable;
};

// NEW FUNCTION: Calculate detailed amortization schedule for risk
export const calculateRiskAmortization = (
  totalRiskValue: number,
  interestRate: number,
  periods: number
): AmortizationEntry[] => {
  return calculateServicesAmortization(totalRiskValue, interestRate, periods);
};
