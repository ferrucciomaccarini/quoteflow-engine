
// Calculate periodic fee (French method - Equal installments)
export const calculatePeriodicFee = (
  principal: number,
  interestRate: number,
  periods: number
): number => {
  // Convert annual interest rate to per-period rate
  const periodicRate = interestRate / 100 / 12;
  
  // If interest rate is zero, simply divide principal by periods
  if (periodicRate === 0) return principal / periods;
  
  // French method formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
  const numerator = periodicRate * Math.pow(1 + periodicRate, periods);
  const denominator = Math.pow(1 + periodicRate, periods) - 1;
  return principal * (numerator / denominator);
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
