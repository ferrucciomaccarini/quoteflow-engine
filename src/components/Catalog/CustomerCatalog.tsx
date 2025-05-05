
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  machine_count?: number;
}

// Define the database insert type to match Supabase schema
interface CustomerInsert {
  user_id: string;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

const CustomerCatalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<CustomerInsert>>({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: ""
  });

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // Get customers with machine counts
        const { data, error } = await supabase
          .from('customers')
          .select(`
            *,
            machines:machines(count)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Transform data to include machine_count
        const transformedData = data.map(customer => ({
          ...customer,
          machine_count: customer.machines?.[0]?.count || 0
        }));

        setCustomers(transformedData);
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load customers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [user, toast]);

  const handleAddCustomer = async () => {
    if (!user) return;
    
    if (!newCustomer.name) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the insert object with required name property
      const customerData: CustomerInsert = {
        ...newCustomer,
        name: newCustomer.name,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();

      if (error) throw error;

      // Add the newly created customer to the state
      setCustomers([...customers, { ...data, machine_count: 0 }]);

      setNewCustomer({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: ""
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove the deleted customer from state
      setCustomers(customers.filter(customer => customer.id !== id));
      
      toast({
        title: "Customer removed",
        description: "The customer has been removed",
      });
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer. Make sure there are no machines assigned to this customer first.",
        variant: "destructive",
      });
    }
  };

  const customerColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "Contact Person", accessorKey: "contact_person" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Machines", accessorKey: "machine_count" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Customer) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/customers/${row.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteCustomer(row.id)}
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
          <h1 className="text-3xl font-bold text-gray-900">Customer List</h1>
          <p className="text-gray-600">
            Manage your customers and their equipment
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={18} />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Add a new customer to your records
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Customer Name*</Label>
                <Input 
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input 
                    id="contactPerson"
                    value={newCustomer.contact_person || ""}
                    onChange={(e) => setNewCustomer({...newCustomer, contact_person: e.target.value})}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={newCustomer.email || ""}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  value={newCustomer.phone || ""}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address"
                  value={newCustomer.address || ""}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            View and manage your customer records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={customerColumns} data={customers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCatalog;
