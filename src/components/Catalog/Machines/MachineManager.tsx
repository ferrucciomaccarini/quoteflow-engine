
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useMachineData } from "./hooks/useMachineData";
import MachineHeader from "./components/MachineHeader";
import MachineTable from "./components/MachineTable";
import MachineForm from "./components/MachineForm";
import EmptyState from "./components/EmptyState";
import { LoadingState, ErrorState } from "./components/LoadingErrorStates";
import { Machine } from "./types";

const MachineManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    category: "",
    acquisition_value: 0,
    description: "",
    daily_rate: 0,
    hourly_rate: 0,
  });
  
  const { machines, setMachines, categories, customers, isLoading, isError } = useMachineData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleAddMachine = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add machines",
        variant: "destructive",
      });
      return;
    }
    
    if (!newMachine.name || !newMachine.category || !newMachine.acquisition_value) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const machineToInsert = {
        name: newMachine.name,
        category: newMachine.category,
        category_id: newMachine.category_id,
        acquisition_value: newMachine.acquisition_value,
        description: newMachine.description || "",
        daily_rate: newMachine.daily_rate || 0,
        hourly_rate: newMachine.hourly_rate || 0,
        customer_id: newMachine.customer_id,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('machines')
        .insert(machineToInsert)
        .select();

      if (error) throw error;

      toast({
        title: "Machine Added",
        description: "The machine has been added to your catalog"
      });

      // Reset form and close dialog
      setNewMachine({
        name: "",
        category: "",
        acquisition_value: 0,
        description: "",
        daily_rate: 0,
        hourly_rate: 0,
      });
      setIsDialogOpen(false);
      
      // Refresh the machines list
      if (data) {
        setMachines([...machines, data[0]]);
      }
    } catch (error: any) {
      console.error('Error adding machine:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add machine",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMachine = async (id: string) => {
    if (!isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setMachines(machines.filter(machine => machine.id !== id));
      toast({
        title: "Machine Deleted",
        description: "The machine has been removed from your catalog"
      });
    } catch (error: any) {
      console.error('Error deleting machine:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete machine",
        variant: "destructive",
      });
    }
  };

  // If not authenticated, show authentication required message
  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Machine Catalog</CardTitle>
          <CardDescription>
            Authentication Required
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10">
          <p className="mb-4 text-center">Please log in to view and manage your machinery.</p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <MachineHeader />
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Add New Machine</DialogTitle>
            <DialogDescription>
              Add a new machine to your equipment catalog
            </DialogDescription>
          </DialogHeader>
          <MachineForm
            newMachine={newMachine}
            setNewMachine={setNewMachine}
            categories={categories}
            customers={customers}
            handleAddMachine={handleAddMachine}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Machinery</CardTitle>
          <CardDescription>
            Browse and manage your equipment catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState isLoading={isLoading} />
          <ErrorState isError={isError} onRetry={() => window.location.reload()} />
          
          {!isLoading && !isError && (
            <>
              {machines.length === 0 ? (
                <EmptyState onAddMachine={() => setIsDialogOpen(true)} />
              ) : (
                <MachineTable 
                  machines={machines} 
                  onDelete={handleDeleteMachine} 
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineManager;
