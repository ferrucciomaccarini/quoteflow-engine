import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineCategory, Customer } from "../types";

// Demo user ID for public access
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

export function useMachineData() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Fetch machine data
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        // Fetch all categories (no user filter)
        const { data: categoryData, error: categoryError } = await supabase
          .from('machine_categories')
          .select('id, name');
        
        if (categoryError) {
          console.error("Error fetching machine categories:", categoryError);
          throw categoryError;
        }
        
        setCategories(categoryData || []);
        
        // Fetch all customers (no user filter)
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, name');
        
        if (customerError) {
          console.error("Error fetching customers:", customerError);
          throw customerError;
        }
        
        setCustomers(customerData || []);
        
        // Fetch all machines (no user filter)
        const { data: machineData, error: machineError } = await supabase
          .from('machines')
          .select('*, customers(name), machine_categories(name)');
        
        if (machineError) {
          console.error("Error fetching machines:", machineError);
          throw machineError;
        }
        
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
  }, [toast]);

  return {
    machines,
    setMachines,
    categories,
    customers,
    isLoading,
    isError
  };
}
