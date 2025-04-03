
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RiskAssessment from "./RiskAssessment";
import { useParams } from "react-router-dom";
import useRiskAssessment from "./RiskAssessment/useRiskAssessment";
import MachineSelector from "./RiskAssessment/MachineSelector";
import AssessmentParameters from "./RiskAssessment/AssessmentParameters";
import EmptyState from "./RiskAssessment/EmptyState";

const RiskAssessmentTool = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const {
    data,
    machines,
    selectedMachine,
    isLoading,
    isSaving,
    updateData,
    handleMachineChange,
    handleSave
  } = useRiskAssessment(machineId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading risk assessment...</p>
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Risk Assessment Tool</h1>
            <p className="text-muted-foreground">
              Assess and quantify risk factors for equipment financing
            </p>
          </div>
        </div>
        
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Risk Assessment Tool</h1>
          <p className="text-muted-foreground">
            Assess and quantify risk factors for equipment financing
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Assessment"}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Paradigmix Risk Assessment Methodology</CardTitle>
            <MachineSelector 
              machines={machines}
              selectedMachineId={selectedMachine?.id}
              onMachineChange={handleMachineChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {selectedMachine && (
            <>
              <AssessmentParameters
                data={data}
                acquisitionValue={selectedMachine.acquisition_value}
                onChange={updateData}
              />
              
              <div className="text-xl font-semibold mb-6 text-center">
                Total Actualized Residual Risk: <span className="text-primary">${data.totalActualizedRisk.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
          
              <RiskAssessment 
                data={{...data, acquisitionValue: selectedMachine.acquisition_value}} 
                updateData={updateData} 
                standalone={true}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentTool;
