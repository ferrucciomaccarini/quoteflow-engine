import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

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
  description?: string | null;
  total_cost?: number;
}

interface MachineService {
  id: string;
  machine_id: string;
  service_id: string;
  service: Service;
}

interface Column<T> {
  header: string;
  accessorKey: string;
  cell?: (row: T) => React.ReactNode;
}

const MachineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [services, setServices] = useState<MachineService[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const calculateTotalCost = (service: Service): number => {
    return (service.parts_cost || 0) + (service.labor_cost || 0) + (service.consumables_cost || 0);
  };

  useEffect(() => {
    const fetchMachineDetails = async () => {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        
        const { data: machineData, error: machineError } = await supabase
          .from('machines')
          .select(`
            *,
            customers(name)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (machineError) throw machineError;
        
        setMachine({
          ...machineData,
          customer_name: machineData.customers?.name
        });

        const { data: machineServices, error: servicesError } = await supabase
          .from('machine_services')
          .select(`
            *,
            service:services(*)
          `)
          .eq('machine_id', id);

        if (servicesError) throw servicesError;
        
        setServices(machineServices);

        const { data: allServices, error: allServicesError } = await supabase
          .from('services')
          .select('*')
          .eq('user_id', user.id);

        if (allServicesError) throw allServicesError;
        
        const attachedServiceIds = machineServices.map(ms => ms.service_id);
        const filteredServices = allServices.filter(service => !attachedServiceIds.includes(service.id));
        
        const servicesWithTotal = filteredServices.map(service => ({
          ...service,
          total_cost: calculateTotalCost(service)
        }));
        
        setAvailableServices(servicesWithTotal);
      } catch (error: any) {
        console.error('Error fetching machine details:', error);
        toast({
          title: "Error",
          description: error.message || "Could not load machine details",
          variant: "destructive",
        });
        navigate("/machines");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachineDetails();
  }, [id, user, toast, navigate]);

  const handleAddServices = async () => {
    if (!user || !id || selectedServices.length === 0) return;

    try {
      const servicesToAdd = selectedServices.map(serviceId => ({
        machine_id: id,
        service_id: serviceId
      }));

      const { data, error } = await supabase
        .from('machine_services')
        .insert(servicesToAdd)
        .select(`
          *,
          service:services(*)
        `);

      if (error) throw error;

      setServices([...services, ...data]);
      
      const newlyAddedServiceIds = data.map(item => item.service_id);
      setAvailableServices(availableServices.filter(service => !newlyAddedServiceIds.includes(service.id)));
      
      setSelectedServices([]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Services have been added to the machine",
      });
    } catch (error: any) {
      console.error('Error adding services:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add services",
        variant: "destructive",
      });
    }
  };

  const handleRemoveService = async (machineServiceId: string) => {
    try {
      const machineService = services.find(ms => ms.id === machineServiceId);
      
      const { error } = await supabase
        .from('machine_services')
        .delete()
        .eq('id', machineServiceId);

      if (error) throw error;

      setServices(services.filter(ms => ms.id !== machineServiceId));
      
      if (machineService && machineService.service) {
        setAvailableServices([...availableServices, machineService.service]);
      }
      
      toast({
        title: "Service removed",
        description: "The service has been removed from this machine",
      });
    } catch (error: any) {
      console.error('Error removing service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove service",
        variant: "destructive",
      });
    }
  };

  const serviceColumns: Column<MachineService>[] = [
    { header: "Service Name", accessorKey: "service.name" },
    { header: "Category", accessorKey: "service.category" },
    { 
      header: "Interval", 
      accessorKey: "interval",
      cell: (row: MachineService) => `${row.service.interval_value} ${row.service.interval_type}`
    },
    {
      header: "Total Cost", 
      accessorKey: "totalCost",
      cell: (row: MachineService) => {
        const totalCost = calculateTotalCost(row.service);
        return `$${totalCost.toFixed(2)}`;
      }
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: MachineService) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleRemoveService(row.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
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

  if (!machine) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Machine not found</h2>
          <p className="mt-2">The machine you're looking for doesn't exist or you don't have access to it.</p>
          <Button className="mt-4" onClick={() => navigate('/machines')}>Back to Machines</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/machines')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to machines
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">{machine.name}</h1>
        <p className="text-gray-600">
          {machine.category}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Acquisition Value
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${machine.acquisition_value.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Rate
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${machine.daily_rate.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hourly Rate
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${machine.hourly_rate.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Machine Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Customer</dt>
              <dd>{machine.customer_name || "No customer assigned"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Category</dt>
              <dd>{machine.category}</dd>
            </div>
            {machine.description && (
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="mt-1">{machine.description}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Machine Services</CardTitle>
            <CardDescription>
              Services and maintenance packages assigned to this machine
            </CardDescription>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" size={16} />
                Assign Services
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Assign Services to Machine</DialogTitle>
                <DialogDescription>
                  Select services to assign to {machine.name}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {availableServices.length === 0 ? (
                  <p className="text-center text-muted-foreground">No available services to add. Please create new services first.</p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {availableServices.map(service => (
                      <div key={service.id} className="flex items-center space-x-2 p-2 border rounded-md">
                        <Checkbox 
                          id={`service-${service.id}`} 
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedServices([...selectedServices, service.id]);
                            } else {
                              setSelectedServices(selectedServices.filter(id => id !== service.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`service-${service.id}`} className="font-medium">{service.name}</Label>
                          <div className="text-xs text-muted-foreground">
                            {service.category} | {service.interval_value} {service.interval_type} | ${service.total_cost?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddServices} disabled={selectedServices.length === 0 || availableServices.length === 0}>
                  Add Selected Services
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No services assigned to this machine yet.</p>
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2" size={16} />
                Assign Services
              </Button>
            </div>
          ) : (
            <DataTable columns={serviceColumns} data={services} />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default MachineDetails;
