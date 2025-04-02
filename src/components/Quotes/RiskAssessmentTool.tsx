import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskAssessment from "./RiskAssessment";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  calculateResidualRisk, 
  calculateMaxLoss, 
  calculateActualizedTotalRisk
} from "@/utils/calculations";
import { useParams, useNavigate } from "react-router-dom";

interface RiskVariable {
  id: string;
  domain: "Finance" | "Usage" | "Strategy" | "Reputation";
  variable: string;
  frequency: number; // 0-100%
  maxLoss: number; // dollar amount
  maxLossPercentage: number; // 0-100% of acquisition value
  mitigation: number; // 0-100%
  residualRisk: number; // calculated
}

interface Machine {
  id: string;
  name: string;
  acquisition_value: number;
}

interface RiskData {
  riskVariables: RiskVariable[];
  avPercentage: number;
  annualDiscountRate: number;
  contractYears: number;
  totalActualizedRisk: number;
  machineId: string;
  acquisitionValue?: number;
  [key: string]: any;
}

const RiskAssessmentTool = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<RiskData>({
    riskVariables: [],
    avPercentage: 50,
    annualDiscountRate: 5.0,
    contractYears: 3,
    totalActualizedRisk: 0,
    machineId: machineId || ''
  });
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadMachines = async () => {
      if (!user) return;
      
      try {
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select('id, name, acquisition_value')
          .eq('user_id', user.id);
          
        if (machinesError) throw machinesError;
        setMachines(machinesData || []);
        
        if (machinesData && machinesData.length > 0) {
          if (machineId) {
            const machine = machinesData.find(m => m.id === machineId);
            if (machine) {
              setSelectedMachine(machine);
              loadRiskAssessment(machine.id);
            } else {
              setSelectedMachine(machinesData[0]);
              loadRiskAssessment(machinesData[0].id);
            }
          } else {
            setSelectedMachine(machinesData[0]);
            loadRiskAssessment(machinesData[0].id);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Error loading machines:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load machines",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadMachines();
  }, [user, machineId, toast]);

  const loadRiskAssessment = async (machineId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: assessment, error: assessmentError } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('machine_id', machineId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (assessmentError) throw assessmentError;
      
      const selectedMachine = machines.find(m => m.id === machineId);
      const acquisitionValue = selectedMachine?.acquisition_value || 0;
      
      if (assessment) {
        const riskData = typeof assessment.risk_data === 'string' 
          ? JSON.parse(assessment.risk_data as string) 
          : assessment.risk_data as RiskData;
        
        let riskVariables = riskData.riskVariables || [];
        if (!riskVariables.length) {
          riskVariables = getDefaultRiskVariables(acquisitionValue, data.avPercentage);
        } else {
          riskVariables = riskVariables.map(risk => ({
            ...risk,
            maxLossPercentage: risk.maxLossPercentage || ((risk.maxLoss / acquisitionValue) * 100) || 1
          }));
        }
        
        const avPercentage = assessment.av_percentage || 50;
        const annualDiscountRate = assessment.annual_discount_rate || 5.0;
        const contractYears = assessment.contract_years || 3;
        const totalActualizedRisk = assessment.total_actualized_residual_risk || 0;
        
        setData({
          riskVariables,
          avPercentage,
          annualDiscountRate,
          contractYears,
          totalActualizedRisk,
          machineId,
          acquisitionValue
        });
      } else {
        setData({
          riskVariables: getDefaultRiskVariables(acquisitionValue, data.avPercentage),
          avPercentage: 50,
          annualDiscountRate: 5.0,
          contractYears: 3,
          totalActualizedRisk: 0,
          machineId,
          acquisitionValue
        });
      }
    } catch (error: any) {
      console.error("Error loading risk assessment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load risk assessment",
        variant: "destructive",
      });

      const selectedMachine = machines.find(m => m.id === machineId);
      const acquisitionValue = selectedMachine?.acquisition_value || 0;
      
      setData({
        riskVariables: getDefaultRiskVariables(acquisitionValue, data.avPercentage),
        avPercentage: 50,
        annualDiscountRate: 5.0,
        contractYears: 3,
        totalActualizedRisk: 0,
        machineId,
        acquisitionValue
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultRiskVariables = (acquisitionValue: number, avPercentage: number): RiskVariable[] => {
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
        variable: "Installment Paid/Unpaid", 
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

  const updateData = (newData: Partial<RiskData>) => {
    setData((prev: RiskData) => {
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
    });
  };

  const handleMachineChange = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (machine) {
      setSelectedMachine(machine);
      navigate(`/risk-assessment/${machineId}`);
      loadRiskAssessment(machineId);
    }
  };

  const handleSave = async () => {
    if (!user || !selectedMachine) {
      toast({
        title: "Error",
        description: "No machine selected or you are not authenticated",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const riskAssessment = {
        user_id: user.id,
        machine_id: selectedMachine.id,
        av_percentage: data.avPercentage,
        annual_discount_rate: data.annualDiscountRate,
        contract_years: data.contractYears,
        total_actualized_residual_risk: data.totalActualizedRisk,
        risk_data: data
      };
      
      const { data: existingAssessment, error: checkError } = await supabase
        .from('risk_assessments')
        .select('id')
        .eq('user_id', user.id)
        .eq('machine_id', selectedMachine.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      let result;
      
      if (existingAssessment) {
        result = await supabase
          .from('risk_assessments')
          .update(riskAssessment)
          .eq('id', existingAssessment.id)
          .select();
      } else {
        result = await supabase
          .from('risk_assessments')
          .insert(riskAssessment)
          .select();
      }
        
      if (result.error) throw result.error;
      
      toast({
        title: "Success",
        description: "Risk assessment saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving risk assessment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save risk assessment",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="mb-4">No machines found. You need to add machines before you can perform risk assessments.</p>
              <Button onClick={() => navigate('/machines')}>
                Go to Machines
              </Button>
            </div>
          </CardContent>
        </Card>
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
            <div className="w-64">
              <Label htmlFor="machine-select">Select Machine</Label>
              <Select 
                value={selectedMachine?.id} 
                onValueChange={handleMachineChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a machine" />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedMachine && (
            <>
              <div className="bg-muted p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Acquisition Value Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[data.avPercentage]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(values) => updateData({ avPercentage: values[0] })}
                    />
                    <span className="w-10 text-right">{data.avPercentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Max Loss: ${(selectedMachine.acquisition_value * (data.avPercentage / 100)).toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Annual Discount Rate</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[data.annualDiscountRate]}
                      min={0.1}
                      max={20}
                      step={0.1}
                      onValueChange={(values) => updateData({ annualDiscountRate: values[0] })}
                    />
                    <span className="w-10 text-right">{data.annualDiscountRate}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Contract Duration (Years)</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[data.contractYears]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(values) => updateData({ contractYears: values[0] })}
                    />
                    <span className="w-10 text-right">{data.contractYears}</span>
                  </div>
                </div>
              </div>
              
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
