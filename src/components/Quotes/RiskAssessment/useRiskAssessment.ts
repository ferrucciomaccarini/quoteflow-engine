
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RiskData, Machine } from './types';
import { getDefaultRiskVariables, updateRiskData } from './utils';
import { useNavigate } from 'react-router-dom';

export const useRiskAssessment = (initialMachineId?: string) => {
  const [data, setData] = useState<RiskData>({
    riskVariables: [],
    avPercentage: 50,
    annualDiscountRate: 5.0,
    contractYears: 3,
    totalActualizedRisk: 0,
    machineId: initialMachineId || ''
  });
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

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
          if (initialMachineId) {
            const machine = machinesData.find(m => m.id === initialMachineId);
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
  }, [user, initialMachineId, toast]);

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

  const updateData = (newData: Partial<RiskData>) => {
    setData(prev => updateRiskData(prev, newData, selectedMachine));
  };

  return {
    data,
    machines,
    selectedMachine,
    isLoading,
    isSaving,
    updateData,
    handleMachineChange,
    handleSave
  };
};

export default useRiskAssessment;
