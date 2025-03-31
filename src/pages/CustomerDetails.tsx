
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Eye, Plus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface Machine {
  id: string;
  name: string;
  category: string;
  acquisition_value: number;
  daily_rate: number;
  hourly_rate: number;
  description: string | null;
  service_count?: number;
}

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customer details
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (customerError) throw customerError;
        
        setCustomer(customerData);

        // Fetch machines assigned to this customer with service counts
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select(`
            *,
            services:machine_services(count)
          `)
          .eq('customer_id', id)
          .eq('user_id', user.id);

        if (machinesError) throw machinesError;
        
        // Transform data to include service_count
        const transformedMachines = machinesData.map(machine => ({
          ...machine,
          service_count: machine.services?.[0]?.count || 0
        }));
        
        setMachines(transformedMachines);
      } catch (error: any) {
        console.error('Error fetching customer details:', error);
        toast({
          title: "Error",
          description: error.message || "Could not load customer details",
          variant: "destructive",
        });
        navigate("/customers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id, user, toast, navigate]);

  const machineColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
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
    { header: "Services", accessorKey: "service_count" },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Machine) => (
        <Button variant="outline" size="sm" onClick={() => navigate(`/machines/${row.id}`)}>
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!customer) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Customer not found</h2>
          <p className="mt-2">The customer you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" onClick={() => navigate('/customers')}>Back to Customers</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/customers')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to customers
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
        <p className="text-gray-600">
          Customer profile and assigned machines
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Contact Person</dt>
              <dd>{customer.contact_person || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd>{customer.email || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
              <dd>{customer.phone || "Not specified"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Address</dt>
              <dd className="mt-1">{customer.address || "Not specified"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Customer Machines</CardTitle>
            <CardDescription>
              Machines assigned to this customer
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/machines')}>
            <Plus className="mr-2" size={16} />
            Add Machine
          </Button>
        </CardHeader>
        <CardContent>
          {machines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No machines assigned to this customer yet.</p>
              <Button className="mt-4" onClick={() => navigate('/machines')}>
                <Plus className="mr-2" size={16} />
                Add Machine
              </Button>
            </div>
          ) : (
            <DataTable columns={machineColumns} data={machines} />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default CustomerDetails;
