
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Machine } from './types';

interface MachineSelectorProps {
  machines: Machine[];
  selectedMachineId: string | undefined;
  onMachineChange: (machineId: string) => void;
}

const MachineSelector: React.FC<MachineSelectorProps> = ({ 
  machines, 
  selectedMachineId, 
  onMachineChange 
}) => {
  return (
    <div className="w-64">
      <Label htmlFor="machine-select">Select Machine</Label>
      <Select 
        value={selectedMachineId} 
        onValueChange={onMachineChange}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Select a machine" />
        </SelectTrigger>
        <SelectContent>
          {machines.map((machine) => (
            <SelectItem key={machine.id} value={machine.id}>
              {machine.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MachineSelector;
