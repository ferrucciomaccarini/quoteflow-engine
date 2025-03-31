
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
  acquisition_value: number;
  daily_rate: number;
  hourly_rate: number;
  description: string | null;
  customer_id: string | null;
  customer_name?: string;
}

const MachineCatalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<{id: string, name: string}[]>([]);
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    category: "",
    acquisition_value: 0,
    daily_rate: 0,
    hourly_rate: 0,
    description: "",
    customer_id: null
  });

  // Fetch machines
  useEffect(() => {
    const fetchMachines = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('machines')
          .select('*, customers(name)')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Transform data to include customer_name
        const transformedData = data.map(item => ({
          ...item,
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

    fetchMachines();
    fetchCustomers();
  }, [user, toast]);

  const handleAddMachine = async () => {
    if (!user) return;
    
    if (!newMachine.name || !newMachine.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('machines')
        .insert({
          ...newMachine,
          user_id: user.id
        })
        .select('*, customers(name)')
        .single();

      if (error) throw error;

      // Add the newly created machine to the state
      setMachines([...machines, {
        ...data,
        customer_name: data.customers?.name || "No Customer"
      }]);

      setNewMachine({
        name: "",
        category: "",
        acquisition_value: 0,
        daily_rate: 0,
        hourly_rate: 0,
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

      // Remove the deleted machine from state
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
      header: "Daily Rate", 
      accessorKey: "daily_rate",
      cell: (row: Machine) => `$${row.daily_rate || '0'}`
    },
    { 
      header: "Hourly Rate", 
      accessorKey: "hourly_rate",
      cell: (row: Machine) => `$${row.hourly_rate || '0'}`
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
                  <Input 
                    id="category"
                    value={newMachine.category}
                    onChange={(e) => setNewMachine({...newMachine, category: e.target.value})}
                    placeholder="Enter category"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Select 
                  value={newMachine.customer_id || ''} 
                  onValueChange={(value) => setNewMachine({...newMachine, customer_id: value || null})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
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
                  <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                  <Input 
                    id="dailyRate"
                    type="number"
                    value={newMachine.daily_rate || ""}
                    onChange={(e) => setNewMachine({
                      ...newMachine, 
                      daily_rate: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourlyRate"
                    type="number"
                    value={newMachine.hourly_rate || ""}
                    onChange={(e) => setNewMachine({
                      ...newMachine, 
                      hourly_rate: parseFloat(e.target.value) || 0
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
