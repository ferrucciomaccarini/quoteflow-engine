
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

interface ServiceInsert {
  user_id: string;
  name: string;
  category: string;
  machine_category: string;
  interval_type: string;
  interval_value?: number;
  parts_cost?: number;
  labor_cost?: number;
  consumables_cost?: number;
  description?: string | null;
}

const ServiceCatalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<ServiceInsert>>({
    name: "",
    category: "Maintenance",
    machine_category: "",
    interval_type: "hours",
    interval_value: 0,
    parts_cost: 0,
    labor_cost: 0,
    consumables_cost: 0,
    description: ""
  });

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const servicesWithTotal = data.map(service => ({
          ...service,
          total_cost: (service.parts_cost || 0) + (service.labor_cost || 0) + (service.consumables_cost || 0)
        }));

        setServices(servicesWithTotal as Service[]);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load services",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [user, toast]);

  const handleAddService = async () => {
    if (!user) return;
    
    if (!newService.name || !newService.category || !newService.machine_category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData: ServiceInsert = {
        ...newService,
        name: newService.name,
        category: newService.category,
        machine_category: newService.machine_category,
        interval_type: newService.interval_type || "hours",
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;

      const newServiceWithTotal = {
        ...data,
        total_cost: (data.parts_cost || 0) + (data.labor_cost || 0) + (data.consumables_cost || 0)
      } as Service;
      
      setServices([...services, newServiceWithTotal]);

      setNewService({
        name: "",
        category: "Maintenance",
        machine_category: "",
        interval_type: "hours",
        interval_value: 0,
        parts_cost: 0,
        labor_cost: 0,
        consumables_cost: 0,
        description: ""
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Service added to catalog",
      });
    } catch (error: any) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setServices(services.filter(service => service.id !== id));
      
      toast({
        title: "Service removed",
        description: "The service has been removed from the catalog",
      });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const serviceColumns = [
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Machine Category", accessorKey: "machine_category" },
    { 
      header: "Interval", 
      accessorKey: "intervalValue",
      cell: (row: Service) => `${row.interval_value} ${row.interval_type}`
    },
    { 
      header: "Total Cost", 
      accessorKey: "total_cost",
      cell: (row: Service) => `$${row.total_cost?.toFixed(2) || '0.00'}`
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Service) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/services/${row.id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteService(row.id)}
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
          <h1 className="text-3xl font-bold text-gray-900">Service Catalog</h1>
          <p className="text-gray-600">
            Manage your service offerings and maintenance packages
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={18} />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Add a new service to your service catalog
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Service Name*</Label>
                  <Input 
                    id="name"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    placeholder="Enter service name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select 
                    value={newService.category} 
                    onValueChange={(value) => setNewService({...newService, category: value})}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Support">Technical Support</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="machineCategory">Machine Category*</Label>
                <Input 
                  id="machineCategory"
                  value={newService.machine_category}
                  onChange={(e) => setNewService({...newService, machine_category: e.target.value})}
                  placeholder="Enter machine category or 'All'"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="intervalType">Interval Type</Label>
                  <Select 
                    value={newService.interval_type} 
                    onValueChange={(value: "hours" | "months") => setNewService({...newService, interval_type: value})}
                  >
                    <SelectTrigger id="intervalType">
                      <SelectValue placeholder="Select interval type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="intervalValue">Interval Value</Label>
                  <Input 
                    id="intervalValue"
                    type="number"
                    value={newService.interval_value || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      interval_value: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="partsCost">Parts Cost ($)</Label>
                  <Input 
                    id="partsCost"
                    type="number"
                    value={newService.parts_cost || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      parts_cost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="laborCost">Labor Cost ($)</Label>
                  <Input 
                    id="laborCost"
                    type="number"
                    value={newService.labor_cost || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      labor_cost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="consumablesCost">Consumables Cost ($)</Label>
                  <Input 
                    id="consumablesCost"
                    type="number"
                    value={newService.consumables_cost || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      consumables_cost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={newService.description || ""}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddService}>Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>
            View and manage your service catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={serviceColumns} data={services} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCatalog;
