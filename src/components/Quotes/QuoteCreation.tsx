
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import StepWizard from "../common/StepWizard";
import { useAuth } from "@/context/AuthContext";
import { saveQuote } from "@/utils/quoteService";
import {
  CustomerNeedsStep,
  EquipmentSelectionStep,
  ServiceSelectionStep,
  FinancialParametersStep,
  RiskAssessmentStep,
  SummaryStep
} from "./Steps";

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
      content: <RiskAssessmentStep />
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
