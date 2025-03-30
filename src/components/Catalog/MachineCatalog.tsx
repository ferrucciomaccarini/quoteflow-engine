
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Mock machinery data
const initialMachines = [
  {
    id: "M1001",
    name: "Industrial Press XL-5000",
    category: "Pressing Equipment",
    acquisitionValue: 85000,
    dailyRate: 350,
    hourlyRate: 45,
    description: "Heavy-duty industrial press with 5000 ton capacity"
  },
  {
    id: "M1002",
    name: "Robotic Arm System R-200",
    category: "Robotics",
    acquisitionValue: 125000,
    dailyRate: 580,
    hourlyRate: 75,
    description: "Precision robotic arm system for manufacturing"
  },
  {
    id: "M1003",
    name: "CNC Machine T-3000",
    category: "CNC Equipment",
    acquisitionValue: 95000,
    dailyRate: 420,
    hourlyRate: 55,
    description: "3-axis CNC machine for precision cutting and milling"
  },
];

interface Machine {
  id: string;
  name: string;
  category: string;
  acquisitionValue: number;
  dailyRate: number;
  hourlyRate: number;
  description: string;
}

const MachineCatalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({
    name: "",
    category: "",
    acquisitionValue: 0,
    dailyRate: 0,
    hourlyRate: 0,
    description: ""
  });

  const handleAddMachine = () => {
    if (!newMachine.name || !newMachine.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const id = `M${Math.floor(1000 + Math.random() * 9000)}`;
    setMachines([...machines, { ...newMachine, id } as Machine]);
    setNewMachine({
      name: "",
      category: "",
      acquisitionValue: 0,
      dailyRate: 0,
      hourlyRate: 0,
      description: ""
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Machine added to catalog",
    });
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter(machine => machine.id !== id));
    toast({
      title: "Machine removed",
      description: "The machine has been removed from the catalog",
    });
  };

  const machineColumns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { 
      header: "Acquisition Value", 
      accessorKey: "acquisitionValue",
      cell: (row: Machine) => `$${row.acquisitionValue.toLocaleString()}`
    },
    { 
      header: "Daily Rate", 
      accessorKey: "dailyRate",
      cell: (row: Machine) => `$${row.dailyRate}`
    },
    { 
      header: "Hourly Rate", 
      accessorKey: "hourlyRate",
      cell: (row: Machine) => `$${row.hourlyRate}`
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: Machine) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
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
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="acquisitionValue">Acquisition Value ($)</Label>
                  <Input 
                    id="acquisitionValue"
                    type="number"
                    value={newMachine.acquisitionValue || ""}
                    onChange={(e) => setNewMachine({
                      ...newMachine, 
                      acquisitionValue: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                  <Input 
                    id="dailyRate"
                    type="number"
                    value={newMachine.dailyRate || ""}
                    onChange={(e) => setNewMachine({
                      ...newMachine, 
                      dailyRate: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input 
                    id="hourlyRate"
                    type="number"
                    value={newMachine.hourlyRate || ""}
                    onChange={(e) => setNewMachine({
                      ...newMachine, 
                      hourlyRate: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={newMachine.description}
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
