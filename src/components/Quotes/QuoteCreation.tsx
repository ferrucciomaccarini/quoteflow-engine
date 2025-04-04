import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import StepWizard from "../common/StepWizard";
import { useAuth } from "@/context/AuthContext";
import { saveQuote, saveQuoteCalculations } from "@/utils/quoteService";
import {
  CustomerNeedsStep,
  EquipmentSelectionStep,
  ServiceSelectionStep,
  FinancialParametersStep,
  RiskAssessmentStep,
  SummaryStep
} from "./Steps";
import { 
  calculateEquipmentAmortization, 
  calculateServicesAmortization, 
  calculateRiskAmortization,
  calculateYearlyServiceCosts
} from "@/utils/calculations";

const QuoteCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleComplete = async (data: any) => {
    console.log("Quote completed:", data);
    
    try {
      setIsSubmitting(true);
      
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
      
      // Save the quote first
      const savedQuote = await saveQuote(quoteData);
      
      if (savedQuote && savedQuote.length > 0) {
        const quoteId = savedQuote[0].id;
        
        // Calculate amortization tables
        const contractDuration = data.timeHorizon || data.contractDuration || 36;
        const totalRate = data.totalRate || 5;
        const machineValue = data.machineValue || 0;
        const servicesPresentValue = data.servicesPresentValue || 0;
        const totalResidualRisk = data.totalResidualRisk || 0;
        const residualValue = data.residualValue || 0;
        
        // Calculate detailed amortization schedules
        const equipmentAmortization = calculateEquipmentAmortization(
          machineValue, 
          totalRate, 
          contractDuration,
          residualValue
        );
        
        const servicesAmortization = calculateServicesAmortization(
          servicesPresentValue,
          totalRate,
          contractDuration
        );
        
        const riskAmortization = calculateRiskAmortization(
          totalResidualRisk,
          totalRate,
          contractDuration
        );
        
        // Calculate yearly service costs
        const serviceEvents = data.serviceEvents || [];
        const yearlyCosts = calculateYearlyServiceCosts(
          serviceEvents,
          Math.ceil(contractDuration / 12)
        );
        
        // Save detailed calculations
        await saveQuoteCalculations({
          quote_id: quoteId,
          time_horizon: contractDuration,
          annual_usage_hours: data.intensityHours || 2000,
          daily_shifts: data.dailyShifts || 1,
          yearCosts: yearlyCosts,
          discount_rate: totalRate,
          present_value: servicesPresentValue,
          equipment_amortization: equipmentAmortization,
          services_amortization: servicesAmortization,
          risk_amortization: riskAmortization
        });
      }
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCustomerNeeds = (data: any) => {
    if (!data.customerId) {
      return "Please select a customer";
    }
    if (!data.timeHorizon || data.timeHorizon <= 0) {
      return "Valid time horizon is required";
    }
    if (!data.intensityHours || data.intensityHours <= 0) {
      return "Usage intensity is required";
    }
    return null;
  };

  const validateEquipmentSelection = (data: any) => {
    if (!data.selectedMachineId) {
      return "Please select a machine";
    }
    return null;
  };

  const validateFinancialParameters = (data: any) => {
    if (!data.creditBureau) {
      return "Credit Bureau score is required";
    }
    if (!data.internalRating) {
      return "Internal rating is required";
    }
    return null;
  };

  const validateServiceSelection = (data: any) => {
    // Service selection is optional
    return null;
  };

  const validateRiskAssessment = (data: any) => {
    if (!data.riskData?.completed) {
      return "Please complete the risk assessment";
    }
    return null;
  };

  const steps = [
    {
      id: "customer-needs",
      title: "Customer Needs",
      description: "Define the customer's business requirements",
      content: (props: any) => <CustomerNeedsStep {...props} />,
      validate: validateCustomerNeeds
    },
    {
      id: "equipment-selection",
      title: "Equipment Selection",
      description: "Select the appropriate machinery",
      content: (props: any) => <EquipmentSelectionStep {...props} />,
      validate: validateEquipmentSelection
    },
    {
      id: "service-selection",
      title: "Service Selection",
      description: "Select the services to include",
      content: (props: any) => <ServiceSelectionStep {...props} />,
      validate: validateServiceSelection
    },
    {
      id: "financial-parameters",
      title: "Financial Parameters",
      description: "Define the financial parameters of the contract",
      content: (props: any) => <FinancialParametersStep {...props} />,
      validate: validateFinancialParameters
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Evaluate risks according to Paradigmix methodology",
      content: (props: any) => <RiskAssessmentStep {...props} />,
      validate: validateRiskAssessment
    },
    {
      id: "summary",
      title: "Summary",
      description: "Review the final EaaS fee structure",
      content: (props: any) => <SummaryStep {...props} />
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
        isSubmitting={isSubmitting}
        initialData={{
          timeHorizon: 36,
          intensityHours: 2000,
          dailyShifts: 1,
          setupTime: 1,
          contractDuration: 36,
          baseRate: 5,
          bureauSpread: 0.01,
          ratingSpread: 0.005,
          totalRate: 6.5,
          residualValuePercentage: 10,
          residualValue: 0
        }}
      />
    </div>
  );
};

export default QuoteCreation;
