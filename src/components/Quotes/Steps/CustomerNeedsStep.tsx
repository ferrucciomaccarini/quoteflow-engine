
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepComponentProps } from "./types";

const CustomerNeedsStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center">
            Customer Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="customerName"
            value={data.customerName || ""}
            onChange={(e) => updateData({ customerName: e.target.value })}
            placeholder="Enter customer name"
            className={!data.customerName ? "border-red-300" : ""}
            aria-required="true"
          />
          {!data.customerName && (
            <p className="text-sm text-red-500">Customer name is required</p>
          )}
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
          <Label htmlFor="timeHorizon" className="flex items-center">
            Time Horizon (months)
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="timeHorizon"
            type="number"
            value={data.timeHorizon || ""}
            onChange={(e) => updateData({ timeHorizon: parseInt(e.target.value) || 0 })}
            placeholder="Enter time horizon"
            className={!data.timeHorizon || data.timeHorizon <= 0 ? "border-red-300" : ""}
            aria-required="true"
          />
          {(!data.timeHorizon || data.timeHorizon <= 0) && (
            <p className="text-sm text-red-500">Valid time horizon is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="intensityHours" className="flex items-center">
            Annual Usage Intensity (hours)
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="intensityHours"
            type="number"
            value={data.intensityHours || ""}
            onChange={(e) => updateData({ intensityHours: parseInt(e.target.value) || 0 })}
            placeholder="Enter annual usage hours"
            className={!data.intensityHours || data.intensityHours <= 0 ? "border-red-300" : ""}
            aria-required="true"
          />
          {(!data.intensityHours || data.intensityHours <= 0) && (
            <p className="text-sm text-red-500">Valid usage intensity is required</p>
          )}
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
