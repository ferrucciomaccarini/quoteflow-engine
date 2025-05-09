
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Machine, MachineCategory, Customer } from "../types";

interface MachineFormProps {
  newMachine: Partial<Machine>;
  setNewMachine: React.Dispatch<React.SetStateAction<Partial<Machine>>>;
  categories: MachineCategory[];
  customers: Customer[];
  handleAddMachine: () => Promise<void>;
  onCancel: () => void;
}

const MachineForm: React.FC<MachineFormProps> = ({
  newMachine,
  setNewMachine,
  categories,
  customers,
  handleAddMachine,
  onCancel
}) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Machine Name*</Label>
          <Input 
            id="name" 
            value={newMachine.name} 
            onChange={(e) => setNewMachine({...newMachine, name: e.target.value})} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category*</Label>
            {categories.length > 0 ? (
              <Select 
                value={newMachine.category_id} 
                onValueChange={(value) => {
                  const selectedCategory = categories.find(cat => cat.id === value);
                  setNewMachine({
                    ...newMachine, 
                    category_id: value,
                    category: selectedCategory ? selectedCategory.name : ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                id="category" 
                value={newMachine.category} 
                onChange={(e) => setNewMachine({...newMachine, category: e.target.value})} 
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="acquisition_value">Acquisition Value*</Label>
            <Input 
              id="acquisition_value" 
              type="number" 
              value={newMachine.acquisition_value} 
              onChange={(e) => setNewMachine({...newMachine, acquisition_value: parseFloat(e.target.value)})} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="daily_rate">Daily Rate</Label>
            <Input 
              id="daily_rate" 
              type="number" 
              value={newMachine.daily_rate} 
              onChange={(e) => setNewMachine({...newMachine, daily_rate: parseFloat(e.target.value)})} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hourly_rate">Hourly Rate</Label>
            <Input 
              id="hourly_rate" 
              type="number" 
              value={newMachine.hourly_rate} 
              onChange={(e) => setNewMachine({...newMachine, hourly_rate: parseFloat(e.target.value)})} 
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="customer">Customer (Optional)</Label>
          <Select 
            value={newMachine.customer_id || "none"} 
            onValueChange={(value) => setNewMachine({...newMachine, customer_id: value === "none" ? undefined : value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={newMachine.description} 
            onChange={(e) => setNewMachine({...newMachine, description: e.target.value})} 
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleAddMachine}>Add Machine</Button>
      </DialogFooter>
    </>
  );
};

export default MachineForm;
