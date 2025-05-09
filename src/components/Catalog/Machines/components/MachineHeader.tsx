
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

const MachineHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Machine Catalog</h1>
        <p className="text-gray-600">
          Manage your equipment and machinery
        </p>
      </div>
      
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" size={18} />
          Add Machine
        </Button>
      </DialogTrigger>
    </div>
  );
};

export default MachineHeader;
