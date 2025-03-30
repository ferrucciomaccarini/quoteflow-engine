
import React, { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
}

interface StepWizardProps {
  steps: Step[];
  onComplete: (data: any) => void;
  initialData?: any;
  className?: string;
}

const StepWizard = ({
  steps,
  onComplete,
  initialData = {},
  className,
}: StepWizardProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => prev - 1);
  };

  const handleStepClick = (index: number) => {
    if (index < currentStepIndex) {
      setCurrentStepIndex(index);
    }
  };

  const handleComplete = () => {
    setIsSubmitting(true);
    try {
      onComplete(data);
    } catch (error) {
      console.error("Error completing wizard:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateData = (newData: any) => {
    setData((prev: any) => ({ ...prev, ...newData }));
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
                  ? "bg-primary text-primary-foreground"
                  : index === currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
              onClick={() => handleStepClick(index)}
              style={{ cursor: index < currentStepIndex ? "pointer" : "default" }}
            >
              {index + 1}
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

      <div className="pmix-card mb-6">
        <h3 className="text-lg font-semibold text-primary mb-1">
          {currentStep.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {currentStep.description}
        </p>
        <div className="py-2">
          {React.isValidElement(currentStep.content)
            ? React.cloneElement(currentStep.content as React.ReactElement, {
                data,
                updateData,
              })
            : currentStep.content}
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
          {isLastStep ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default StepWizard;
