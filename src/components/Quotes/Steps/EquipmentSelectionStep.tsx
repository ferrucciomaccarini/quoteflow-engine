
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Machine, StepComponentProps } from "./types";

const EquipmentSelectionStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMachines = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data: machinesData, error } = await supabase
          .from('machines')
          .select('id, name, category, acquisition_value')
          .eq('user_id', user.id);

        if (error) throw error;
        
        setMachines(machinesData || []);
      } catch (error: any) {
        console.error('Error fetching machines:', error);
        toast({
          title: "Error",
          description: "Failed to load machines from catalog",
          variant: "destructive",
        });
        
        // Fall back to demo machines if fetch fails
        setMachines([
          {
            id: "M1001",
            name: "Industrial Press XL-5000",
            category: "Pressing Equipment",
            acquisition_value: 85000,
          },
          {
            id: "M1002",
            name: "Robotic Arm System R-200",
            category: "Robotics",
            acquisition_value: 125000,
          },
          {
            id: "M1003",
            name: "CNC Machine T-3000",
            category: "CNC Equipment",
            acquisition_value: 95000,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, [user, toast]);

  const selectedMachine = machines.find(m => m.id === data.selectedMachineId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="selectedMachineId">Select Equipment from Your Machine Catalog</Label>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Loading machines...</span>
          </div>
        ) : (
          <Select 
            value={data.selectedMachineId || ""} 
            onValueChange={(value) => {
              const machine = machines.find(m => m.id === value);
              updateData({ 
                selectedMachineId: value,
                machineName: machine?.name,
                machineValue: machine?.acquisition_value || 0
              });
            }}
          >
            <SelectTrigger id="selectedMachineId">
              <SelectValue placeholder="Select machinery" />
            </SelectTrigger>
            <SelectContent>
              {machines.length === 0 ? (
                <SelectItem value="none" disabled>No machines available in catalog</SelectItem>
              ) : (
                machines.map(machine => (
                  <SelectItem key={machine.id} value={machine.id}>
                    {machine.name} - ${machine.acquisition_value.toLocaleString()}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
        
        {machines.length === 0 && !isLoading && (
          <div className="mt-2 text-sm text-amber-600">
            <p>No machinery found in your catalog. <Button variant="link" className="h-auto p-0" onClick={() => window.open('/machines', '_blank')}>Add machines to your catalog</Button> first.</p>
          </div>
        )}
      </div>

      {selectedMachine && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle>{selectedMachine.name}</CardTitle>
            <CardDescription>Category: {selectedMachine.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>Acquisition Value:</span>
              <span className="font-medium">${selectedMachine.acquisition_value.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EquipmentSelectionStep;
