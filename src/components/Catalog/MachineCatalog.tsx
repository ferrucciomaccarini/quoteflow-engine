
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Machine {
  id: string;
  name: string;
  category: string;
  category_id: string | null;
  acquisition_value: number;
  average_annual_usage_hours: number;
  estimated_useful_life: number;
  description: string | null;
  customer_id: string | null;
  customer_name?: string;
}

interface MachineCategory {
  id: string;
  name: string;
}

interface MachineInsert {
  user_id: string;
  name: string;
  category_id: string | null;
  category?: string; // For backward compatibility
  acquisition_value?: number;
  average_annual_usage_hours?: number;
  estimated_useful_life?: number;
  description?: string | null;
  customer_id?: string | null;
}

const MachineCatalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<{id: string, name: string}[]>([]);
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [newMachine, setNewMachine] = useState<Partial<MachineInsert>>({
    name: "",
    category_id: null,
    acquisition_value: 0,
    average_annual_usage_hours: 0,
    estimated_useful_life: 0,
    description: "",
    customer_id: null
  });

  useEffect(() => {
    const fetchMachines = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('machines')
          .select(`
            *,
            customers(name),
            machine_categories(name)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        const transformedData = data.map(item => ({
          ...item,
          category: item.machine_categories?.name || item.category || "Uncategorized",
          customer_name: item.customers?.name || "No Customer"
        }));

        setMachines(transformedData);
      } catch (error: any) {
        console.error('Error fetching machines:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load machines",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCustomers = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, name')
          .eq('user_id', user.id);

        if (error) throw error;
        setCustomers(data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchCategories = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('machine_categories')
          .select('id, name')
          .eq('user_id', user.id);

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching machine categories:', error);
      }
    };

    fetchMachines();
    fetchCustomers();
    fetchCategories();
  }, [user, toast]);

  const handleAddMachine = async () => {
    if (!user) return;
    
    if (!newMachine.name) {
      toast({
        title: "Error",
        description: "Machine name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const machineData: MachineInsert = {
        ...newMachine,
        user_id: user.id
      };

      // Handle the special case where we might need to fetch category name
      if (machineData.category_id) {
        const category = categories.find(c => c.id === machineData.category_id);
        if (category) {
          machineData.category = category.name;
        }
      }

      const { data, error } = await supabase
        .from('machines')
        .insert(machineData)
        .select(`
          *,
          customers(name),
          machine_categories(name)
        `)
        .single();

      if (error) throw error;

      const newMachineWithExtras = {
        ...data,
        category: data.machine_categories?.name || data.category || "Uncategorized",
        customer_name: data.customers?.name || "No Customer"
      };

      setMachines([...machines, newMachineWithExtras]);

      setNewMachine({
        name: "",
        category_id: null,
        acquisition_value: 0,
        average_annual_usage_hours: 0,
        estimated_useful_life: 0,
        description: "",
        customer_id: null
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Machine added to catalog",
      });
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
    if (!user) return;

    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMachines(machines.filter(machine => machine.id !== id));
      
      toast({
        title: "Machine removed",
        description: "The machine has been removed from the catalog",
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

  const machineColumns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Customer", accessorKey: "customer_name" },
    { 
      header: "Acquisition Value", 
      accessorKey: "acquisition_value",
      cell: (row: Machine) => `$${row.acquisition_value?.toLocaleString() || '0'}`
    },
    { 
      header: "Annual Usage Hours", 
      accessorKey: "average_annual_usage_hours",
      cell: (row: Machine) => `${row.average_annual_usage_hours || '0'} hours`
    },
    { 
      header: "Useful Life", 
      accessorKey: "estimated_useful_life",
      cell: (row: Machine) => `${row.estimated_useful_life || '0'} years`
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Machine) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/machines/${row.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteMachine(row.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Machine Catalog</h1>
          <p className="text-gray-600">
            Manage your machinery and equipment
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/machine-categories')}>
            Manage Categories
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Machine Name*</Label>
                    <Input 
                      id="name"
                      value={newMachine.name}
                      onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
                      placeholder="Enter machine name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select 
                      value={newMachine.category_id || undefined} 
                      onValueChange={(value) => setNewMachine({...newMachine, category_id: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length === 0 ? (
                          <SelectItem value="none" disabled>No categories available</SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {categories.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Please add categories first from the Machine Categories page
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select 
                    value={newMachine.customer_id || undefined} 
                    onValueChange={(value) => setNewMachine({...newMachine, customer_id: value || null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="acquisitionValue">Acquisition Value ($)</Label>
                    <Input 
                      id="acquisitionValue"
                      type="number"
                      value={newMachine.acquisition_value || ""}
                      onChange={(e) => setNewMachine({
                        ...newMachine, 
                        acquisition_value: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="averageAnnualUsage">Annual Usage Hours</Label>
                    <Input 
                      id="averageAnnualUsage"
                      type="number"
                      value={newMachine.average_annual_usage_hours || ""}
                      onChange={(e) => setNewMachine({
                        ...newMachine, 
                        average_annual_usage_hours: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="estimatedUsefulLife">Useful Life (Years)</Label>
                    <Input 
                      id="estimatedUsefulLife"
                      type="number"
                      value={newMachine.estimated_useful_life || ""}
                      onChange={(e) => setNewMachine({
                        ...newMachine, 
                        estimated_useful_life: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={newMachine.description || ""}
                    onChange={(e) => setNewMachine({...newMachine, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMachine}>Add Machine</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Machinery List</CardTitle>
          <CardDescription>
            View and manage your machinery catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={machineColumns} data={machines} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineCatalog;
