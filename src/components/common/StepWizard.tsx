
import React, { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  content: ReactNode | ((props: any) => ReactNode);
  validate?: (data: any) => string | null;
}

interface StepWizardProps {
  steps: Step[];
  onComplete: (data: any) => void;
  initialData?: any;
  className?: string;
  isSubmitting?: boolean;
}

const StepWizard = ({
  steps,
  onComplete,
  initialData = {},
  className,
  isSubmitting = false,
}: StepWizardProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState(initialData);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    const currentValidator = currentStep.validate;
    
    if (currentValidator) {
      const error = currentValidator(data);
      if (error) {
        setValidationError(error);
        return;
      }
    }
    
    setValidationError(null);
    
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setCurrentStepIndex((prev) => prev - 1);
  };

  const handleStepClick = (index: number) => {
    if (index < currentStepIndex) {
      setValidationError(null);
      setCurrentStepIndex(index);
    }
  };

  const handleComplete = () => {
    try {
      onComplete(data);
    } catch (error) {
      console.error("Error completing wizard:", error);
    }
  };

  const updateData = (newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }));
    // Clear validation error when data is updated
    setValidationError(null);
  };

  const renderStepContent = () => {
    const { content } = currentStep;
    const props = { data, updateData };
    
    if (typeof content === 'function') {
      return content(props);
    }
    
    return content;
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex mb-6 overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center mr-4",
              index > 0 && "ml-2"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full mr-2 transition-colors",
                index < currentStepIndex
                  ? "bg-green-500 text-primary-foreground"
                  : index === currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
              onClick={() => handleStepClick(index)}
              style={{ cursor: index < currentStepIndex ? "pointer" : "default" }}
            >
              {index < currentStepIndex ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div
              className={cn(
                "hidden sm:block text-sm font-medium",
                index === currentStepIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </div>
            {index < steps.length - 1 && (
              <div className="hidden sm:block mx-4 h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <div className="pmix-card mb-6">
        <h3 className="text-lg font-semibold text-primary mb-1">
          {currentStep.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {currentStep.description}
        </p>
        <div className="py-2">
          {renderStepContent()}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
        >
          Back
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLastStep ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepWizard;
