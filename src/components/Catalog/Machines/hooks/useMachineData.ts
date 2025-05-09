
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineCategory, Customer } from "../types";

export function useMachineData() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Fetch machine data
  useEffect(() => {
    const fetchMachines = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setIsError(false);
        
        console.log("Fetching machines data for user:", user?.id);
        
        // First, fetch categories for reference
        const { data: categoryData, error: categoryError } = await supabase
          .from('machine_categories')
          .select('id, name')
          .eq('user_id', user?.id);
        
        if (categoryError) {
          console.error("Error fetching machine categories:", categoryError);
          throw categoryError;
        }
        
        setCategories(categoryData || []);
        
        // Then fetch customers for reference
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, name')
          .eq('user_id', user?.id);
        
        if (customerError) {
          console.error("Error fetching customers:", customerError);
          throw customerError;
        }
        
        setCustomers(customerData || []);
        
        // Finally fetch machines with related data
        const { data: machineData, error: machineError } = await supabase
          .from('machines')
          .select('*, customers(name), machine_categories(name)')
          .eq('user_id', user?.id);
        
        if (machineError) {
          console.error("Error fetching machines:", machineError);
          throw machineError;
        }
        
        console.log("Received machines data:", machineData);
        setMachines(machineData || []);
      } catch (error: any) {
        console.error('Error in fetch operation:', error);
        setIsError(true);
        toast({
          title: "Error loading machines",
          description: error.message || "Failed to load machine data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, [user, isAuthenticated, toast]);

  return {
    machines,
    setMachines,
    categories,
    customers,
    isLoading,
    isError
  };
}
