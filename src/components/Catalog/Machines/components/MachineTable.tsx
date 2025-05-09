
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { Machine } from "../types";

interface MachineTableProps {
  machines: Machine[];
  onDelete: (id: string) => Promise<void>;
}

const MachineTable: React.FC<MachineTableProps> = ({ machines, onDelete }) => {
  const navigate = useNavigate();

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { 
      header: "Value", 
      accessorKey: "acquisition_value",
      cell: (info: Machine) => `$${Number(info.acquisition_value).toLocaleString()}`
    },
    { 
      header: "Daily Rate", 
      accessorKey: "daily_rate",
      cell: (info: Machine) => info.daily_rate ? `$${Number(info.daily_rate).toLocaleString()}` : "N/A"
    },
    { 
      header: "Hourly Rate", 
      accessorKey: "hourly_rate",
      cell: (info: Machine) => info.hourly_rate ? `$${Number(info.hourly_rate).toLocaleString()}` : "N/A"
    },
    { 
      header: "Customer", 
      accessorKey: "customers.name", 
      cell: (info: Machine) => info.customers?.name || "None"
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (info: Machine) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/machines/${info.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(info.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={machines} 
    />
  );
};

export default MachineTable;
