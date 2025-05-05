import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Machine {
  id: string;
  name: string;
  category: string;
  acquisition_value: number;
  description?: string;
  daily_rate?: number;
  hourly_rate?: number;
  customer_id?: string;
  customers?: { name: string } | null;
  machine_categories?: { name: string } | null;
  category_id?: string;
}

interface MachineCategory {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  name: string;
}

const MachineCatalog: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    category: "",
    acquisition_value: 0,
    description: "",
    daily_rate: 0,
    hourly_rate: 0,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { 
      header: "Value", 
      accessorKey: "acquisition_value",
      cell: (info: any) => `$${Number(info.getValue()).toLocaleString()}` 
    },
    { 
      header: "Daily Rate", 
      accessorKey: "daily_rate",
      cell: (info: any) => info.getValue() ? `$${Number(info.getValue()).toLocaleString()}` : "N/A"
    },
    { 
      header: "Hourly Rate", 
      accessorKey: "hourly_rate",
      cell: (info: any) => info.getValue() ? `$${Number(info.getValue()).toLocaleString()}` : "N/A"
    },
    { 
      header: "Customer", 
      accessorKey: "customers.name", 
      cell: (info: any) => info.getValue() || "None"
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (info: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/machines/${info.getValue()}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteMachine(info.getValue())}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Machine Catalog</h1>
          <p className="text-gray-600">
            Manage your equipment and machinery
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={18} />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Machine</DialogTitle>
              <DialogDescription>
                Add a new machine to your equipment catalog
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Machine Name*</Label>
                <Input 
                  id="name" 
                  value={newMachine.name} 
                  onChange={(e) => setNewMachine({...newMachine, name: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category*</Label>
                  {categories.length > 0 ? (
                    <Select 
                      value={newMachine.category_id} 
                      onValueChange={(value) => {
                        const selectedCategory = categories.find(cat => cat.id === value);
                        setNewMachine({
                          ...newMachine, 
                          category_id: value,
                          category: selectedCategory ? selectedCategory.name : ''
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="category" 
                      value={newMachine.category} 
                      onChange={(e) => setNewMachine({...newMachine, category: e.target.value})} 
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="acquisition_value">Acquisition Value*</Label>
                  <Input 
                    id="acquisition_value" 
                    type="number" 
                    value={newMachine.acquisition_value} 
                    onChange={(e) => setNewMachine({...newMachine, acquisition_value: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="daily_rate">Daily Rate</Label>
                  <Input 
                    id="daily_rate" 
                    type="number" 
                    value={newMachine.daily_rate} 
                    onChange={(e) => setNewMachine({...newMachine, daily_rate: parseFloat(e.target.value)})} 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hourly_rate">Hourly Rate</Label>
                  <Input 
                    id="hourly_rate" 
                    type="number" 
                    value={newMachine.hourly_rate} 
                    onChange={(e) => setNewMachine({...newMachine, hourly_rate: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer">Customer (Optional)</Label>
                <Select 
                  value={newMachine.customer_id || "none"} 
                  onValueChange={(value) => setNewMachine({...newMachine, customer_id: value === "none" ? undefined : value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newMachine.description} 
                  onChange={(e) => setNewMachine({...newMachine, description: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMachine}>Add Machine</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machinery</CardTitle>
          <CardDescription>
            Browse and manage your equipment catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Failed to load machines data.</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : machines.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No machinery in your catalog yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Machine
              </Button>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={machines} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineCatalog;
