
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerNeedsStepProps {
  data: any;
  updateData: (data: any) => void;
}

const CustomerNeedsStep: React.FC<CustomerNeedsStepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input 
            id="customerName"
            value={data.customerName || ""}
            onChange={(e) => updateData({ customerName: e.target.value })}
            placeholder="Enter customer name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input 
            id="contactPerson"
            value={data.contactPerson || ""}
            onChange={(e) => updateData({ contactPerson: e.target.value })}
            placeholder="Enter contact person"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeHorizon">Time Horizon (months)</Label>
          <Input 
            id="timeHorizon"
            type="number"
            value={data.timeHorizon || ""}
            onChange={(e) => updateData({ timeHorizon: parseInt(e.target.value) || 0 })}
            placeholder="Enter time horizon"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="intensityHours">Annual Usage Intensity (hours)</Label>
          <Input 
            id="intensityHours"
            type="number"
            value={data.intensityHours || ""}
            onChange={(e) => updateData({ intensityHours: parseInt(e.target.value) || 0 })}
            placeholder="Enter annual usage hours"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyShifts">Daily Work Shifts</Label>
          <Select 
            value={data.dailyShifts?.toString() || ""} 
            onValueChange={(value) => updateData({ dailyShifts: parseInt(value) || 1 })}
          >
            <SelectTrigger id="dailyShifts">
              <SelectValue placeholder="Select shifts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Shift (8 hours)</SelectItem>
              <SelectItem value="2">2 Shifts (16 hours)</SelectItem>
              <SelectItem value="3">3 Shifts (24 hours)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="setupTime">Average Setup Time (hours)</Label>
          <Input 
            id="setupTime"
            type="number"
            value={data.setupTime || ""}
            onChange={(e) => updateData({ setupTime: parseFloat(e.target.value) || 0 })}
            placeholder="Enter average setup time"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerNeedsStep;
