
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Eye } from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  machine_category: string;
  interval_type: string;
  interval_value: number;
  parts_cost: number;
  labor_cost: number;
  consumables_cost: number;
  description: string | null;
  total_cost?: number;
}

interface MachineWithService {
  id: string;
  machine_id: string;
  service_id: string;
  machine: {
    id: string;
    name: string;
    category: string;
    customer_name?: string;
  };
}

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [machines, setMachines] = useState<MachineWithService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        // Fetch service details
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (serviceError) throw serviceError;
        
        // Calculate total cost
        const totalCost = (serviceData.parts_cost || 0) + 
                         (serviceData.labor_cost || 0) + 
                         (serviceData.consumables_cost || 0);
                         
        setService({
          ...serviceData,
          total_cost: totalCost
        });

        // Fetch machines that have this service assigned
        const { data: machineServicesData, error: machinesError } = await supabase
          .from('machine_services')
          .select(`
            id,
            machine_id,
            service_id,
            machine:machines(
              id, 
              name, 
              category,
              customers(name)
            )
          `)
          .eq('service_id', id);

        if (machinesError) throw machinesError;
        
        // Transform data to include customer_name
        const transformedData = machineServicesData.map(item => ({
          ...item,
          machine: {
            ...item.machine,
            customer_name: item.machine.customers?.name || "No Customer"
          }
        }));
        
        setMachines(transformedData);
      } catch (error: any) {
        console.error('Error fetching service details:', error);
        toast({
          title: "Error",
          description: error.message || "Could not load service details",
          variant: "destructive",
        });
        navigate("/services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, user, toast, navigate]);

  const machineColumns = [
    { header: "Machine Name", accessorKey: "machine.name" },
    { header: "Category", accessorKey: "machine.category" },
    { header: "Customer", accessorKey: "machine.customer_name" },
    {
      header: "Actions",
      accessorKey: "machine.id",
      cell: (row: MachineWithService) => (
        <Button variant="outline" size="sm" onClick={() => navigate(`/machines/${row.machine.id}`)}>
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

  if (!service) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Service not found</h2>
          <p className="mt-2">The service you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" onClick={() => navigate('/services')}>Back to Services</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/services')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to services
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
        <p className="text-gray-600">
          {service.category} service for {service.machine_category} machines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Parts Cost
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${service.parts_cost.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Labor Cost
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${service.labor_cost.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${service.total_cost?.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Service Type</dt>
              <dd>{service.category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Machine Category</dt>
              <dd>{service.machine_category}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Service Interval</dt>
              <dd>{service.interval_value} {service.interval_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Consumables Cost</dt>
              <dd>${service.consumables_cost.toLocaleString()}</dd>
            </div>
            {service.description && (
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1">{service.description}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Machines Using This Service</CardTitle>
          <CardDescription>
            Machines that have this service assigned
          </CardDescription>
        </CardHeader>
        <CardContent>
          {machines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No machines are currently using this service.</p>
            </div>
          ) : (
            <DataTable columns={machineColumns} data={machines} />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ServiceDetails;
