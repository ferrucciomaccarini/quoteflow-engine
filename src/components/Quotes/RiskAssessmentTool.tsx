
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RiskAssessment from "./RiskAssessment";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { calculateResidualRisk } from "@/utils/calculations";

interface RiskVariable {
  id: string;
  domain: "Finance" | "Usage" | "Strategy" | "Reputation";
  variable: string;
  frequency: number;
  maxLoss: number;
  mitigation: number;
  residualRisk: number;
}

interface RiskData {
  riskVariables: RiskVariable[];
  [key: string]: any;
}

const RiskAssessmentTool = () => {
  const [data, setData] = useState<RiskData>({
    riskVariables: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadRiskAssessment = async () => {
      if (!user) return;
      
      try {
        // Look for risk assessment data in quotes table with assessment_type='risk'
        const { data: savedData, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'risk_assessment')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.log("No saved risk assessment found or error:", error);
          // Initialize with default data when no saved assessment exists
          setData({
            riskVariables: getDefaultRiskVariables()
          });
          return;
        }
        
        if (savedData && savedData.quote_data) {
          // Extract risk data from the quote_data JSON field
          const riskData = savedData.quote_data as RiskData;
          setData(riskData);
        } else {
          setData({
            riskVariables: getDefaultRiskVariables()
          });
        }
      } catch (error) {
        console.error("Error loading risk assessment:", error);
        setData({
          riskVariables: getDefaultRiskVariables()
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRiskAssessment();
  }, [user]);

  const getDefaultRiskVariables = (): RiskVariable[] => {
    const defaultRiskVariables: RiskVariable[] = [
      // Finance domain
      { id: "F1", domain: "Finance", variable: "Credit Risk", frequency: 20, maxLoss: 10000, mitigation: 60, residualRisk: 0 },
      { id: "F2", domain: "Finance", variable: "Currency Risk", frequency: 30, maxLoss: 5000, mitigation: 70, residualRisk: 0 },
      { id: "F3", domain: "Finance", variable: "Liquidity Risk", frequency: 15, maxLoss: 12000, mitigation: 65, residualRisk: 0 },
      { id: "F4", domain: "Finance", variable: "Market Risk", frequency: 25, maxLoss: 8000, mitigation: 55, residualRisk: 0 },
      
      // Usage domain
      { id: "U1", domain: "Usage", variable: "Operational Risk", frequency: 35, maxLoss: 15000, mitigation: 75, residualRisk: 0 },
      { id: "U2", domain: "Usage", variable: "Maintenance Risk", frequency: 40, maxLoss: 9000, mitigation: 80, residualRisk: 0 },
      { id: "U3", domain: "Usage", variable: "Performance Risk", frequency: 20, maxLoss: 7500, mitigation: 70, residualRisk: 0 },
      { id: "U4", domain: "Usage", variable: "Technology Risk", frequency: 15, maxLoss: 11000, mitigation: 60, residualRisk: 0 },
      
      // Strategy domain
      { id: "S1", domain: "Strategy", variable: "Regulatory Risk", frequency: 10, maxLoss: 20000, mitigation: 80, residualRisk: 0 },
      { id: "S2", domain: "Strategy", variable: "Competitive Risk", frequency: 25, maxLoss: 7500, mitigation: 50, residualRisk: 0 },
      { id: "S3", domain: "Strategy", variable: "Resource Risk", frequency: 20, maxLoss: 9000, mitigation: 65, residualRisk: 0 },
      { id: "S4", domain: "Strategy", variable: "Market Change Risk", frequency: 15, maxLoss: 8500, mitigation: 60, residualRisk: 0 },
      
      // Reputation domain
      { id: "R1", domain: "Reputation", variable: "Brand Risk", frequency: 10, maxLoss: 25000, mitigation: 70, residualRisk: 0 },
      { id: "R2", domain: "Reputation", variable: "Relationship Risk", frequency: 15, maxLoss: 12000, mitigation: 75, residualRisk: 0 },
      { id: "R3", domain: "Reputation", variable: "Compliance Risk", frequency: 20, maxLoss: 18000, mitigation: 85, residualRisk: 0 },
      { id: "R4", domain: "Reputation", variable: "Social Media Risk", frequency: 30, maxLoss: 15000, mitigation: 60, residualRisk: 0 },
    ];
    
    // Pre-calculate residual risks
    return defaultRiskVariables.map(risk => ({
      ...risk,
      residualRisk: calculateResidualRisk(risk.maxLoss, risk.mitigation, risk.frequency)
    }));
  };

  const updateData = (newData: any) => {
    setData((prev: RiskData) => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to save risk assessments",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Calculate the total risk from all variables
      const totalRisk = data.riskVariables.reduce((sum: number, risk: RiskVariable) => sum + risk.residualRisk, 0);
      
      // Save as a quote with status='risk_assessment'
      const { error } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          customer_name: "Risk Assessment",
          machine_name: "N/A",
          machine_value: totalRisk,
          time_horizon: 12,
          contract_duration: 12,
          total_fee: totalRisk,
          status: "risk_assessment",
          quote_data: data
        });
        
      if (error) throw error;
      
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
          <CardTitle>Paradigmix Risk Assessment Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This tool implements the Paradigmix risk assessment methodology for Equipment as a Service (EaaS) financing. 
            Adjust the variables across four risk domains to quantify total residual risk.
          </p>
          
          <RiskAssessment data={data} updateData={updateData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentTool;
