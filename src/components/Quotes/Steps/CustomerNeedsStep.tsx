
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepComponentProps } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  contact_person: string | null;
}

const CustomerNeedsStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data: customersData, error } = await supabase
          .from('customers')
          .select('id, name, contact_person');
        
        if (error) throw error;
        
        setCustomers(customersData || []);
      } catch (error: any) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: "Failed to load customer list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [toast]);

  const handleCustomerChange = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      updateData({ 
        customerId: customerId,
        customerName: selectedCustomer.name,
        contactPerson: selectedCustomer.contact_person || ''
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center">
            Customer
            <span className="text-red-500 ml-1">*</span>
          </Label>
          {loading ? (
            <div className="h-10 w-full animate-pulse bg-gray-200 rounded-md"></div>
          ) : (
            <Select 
              value={data.customerId || ""} 
              onValueChange={handleCustomerChange}
            >
              <SelectTrigger id="customerName" className={!data.customerId ? "border-red-300" : ""}>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {customers.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No customers found</div>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
          {!data.customerId && (
            <p className="text-sm text-red-500">Customer selection is required</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input 
            id="contactPerson"
            value={data.contactPerson || ""}
            onChange={(e) => updateData({ contactPerson: e.target.value })}
            placeholder="Enter contact person"
            readOnly={data.customerId ? true : false}
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
