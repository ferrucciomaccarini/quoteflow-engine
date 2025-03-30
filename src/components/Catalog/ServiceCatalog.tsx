import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  category: string;
  machineCategory: string;
  intervalType: "hours" | "months";
  intervalValue: number;
  partsCost: number;
  laborCost: number;
  consumablesCost: number;
  description: string;
}

const initialServices: Service[] = [
  {
    id: "S1001",
    name: "Preventive Maintenance - Basic",
    category: "Maintenance",
    machineCategory: "Pressing Equipment",
    intervalType: "hours",
    intervalValue: 500,
    partsCost: 350,
    laborCost: 250,
    consumablesCost: 100,
    description: "Basic preventive maintenance package including inspection and lubrication"
  },
  {
    id: "S1002",
    name: "Preventive Maintenance - Advanced",
    category: "Maintenance",
    machineCategory: "Robotics",
    intervalType: "months",
    intervalValue: 3,
    partsCost: 750,
    laborCost: 500,
    consumablesCost: 250,
    description: "Advanced maintenance package including calibration and software updates"
  },
  {
    id: "S1003",
    name: "Equipment Insurance - Standard",
    category: "Insurance",
    machineCategory: "All",
    intervalType: "months",
    intervalValue: 1,
    partsCost: 0,
    laborCost: 0,
    consumablesCost: 0,
    description: "Standard insurance coverage for equipment"
  },
];

const ServiceCatalog = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    category: "Maintenance",
    machineCategory: "",
    intervalType: "hours",
    intervalValue: 0,
    partsCost: 0,
    laborCost: 0,
    consumablesCost: 0,
    description: ""
  });

  const handleAddService = () => {
    if (!newService.name || !newService.category || !newService.machineCategory) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const id = `S${Math.floor(1000 + Math.random() * 9000)}`;
    setServices([...services, { ...newService, id } as Service]);
    setNewService({
      name: "",
      category: "Maintenance",
      machineCategory: "",
      intervalType: "hours",
      intervalValue: 0,
      partsCost: 0,
      laborCost: 0,
      consumablesCost: 0,
      description: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Service added to catalog",
    });
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Service removed",
      description: "The service has been removed from the catalog",
    });
  };

  const serviceColumns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { header: "Machine Category", accessorKey: "machineCategory" },
    { 
      header: "Interval", 
      accessorKey: "intervalValue",
      cell: (row: Service) => `${row.intervalValue} ${row.intervalType}`
    },
    { 
      header: "Parts Cost", 
      accessorKey: "partsCost",
      cell: (row: Service) => `$${row.partsCost}`
    },
    { 
      header: "Labor Cost", 
      accessorKey: "laborCost",
      cell: (row: Service) => `$${row.laborCost}`
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Service) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
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
                  value={newService.machineCategory}
                  onChange={(e) => setNewService({...newService, machineCategory: e.target.value})}
                  placeholder="Enter machine category or 'All'"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="intervalType">Interval Type</Label>
                  <Select 
                    value={newService.intervalType} 
                    onValueChange={(value: "hours" | "months") => setNewService({...newService, intervalType: value})}
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
                    value={newService.intervalValue || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      intervalValue: parseInt(e.target.value) || 0
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
                    value={newService.partsCost || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      partsCost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="laborCost">Labor Cost ($)</Label>
                  <Input 
                    id="laborCost"
                    type="number"
                    value={newService.laborCost || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      laborCost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="consumablesCost">Consumables Cost ($)</Label>
                  <Input 
                    id="consumablesCost"
                    type="number"
                    value={newService.consumablesCost || ""}
                    onChange={(e) => setNewService({
                      ...newService, 
                      consumablesCost: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={newService.description}
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
