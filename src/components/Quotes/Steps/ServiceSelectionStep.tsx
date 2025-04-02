
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateServiceEvents, calculateServicePresentValue } from "@/utils/calculations";
import { Service, StepComponentProps } from "./types";

const ServiceSelectionStep: React.FC<StepComponentProps> = ({ data, updateData }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const selectedMachineId = data.selectedMachineId;

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data: servicesData, error } = await supabase
          .from('services')
          .select('id, name, category, parts_cost, labor_cost, consumables_cost, interval_type, interval_value, machine_id')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Filter services based on the selected machine
        const filteredServices = selectedMachineId 
          ? servicesData.filter((service) => service.machine_id === selectedMachineId)
          : [];
        
        // Add insurance service dynamically
        const servicesWithInsurance = [
          ...filteredServices,
          {
            id: "S1003",
            name: "Equipment Insurance - Standard",
            category: "Insurance",
            parts_cost: 0,
            labor_cost: 0,
            consumables_cost: 0,
            interval_type: "months",
            interval_value: 1,
            fixed_cost: 350,
          }
        ];

        setServices(servicesWithInsurance);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast({
          title: "Error",
          description: "Failed to load services from catalog",
          variant: "destructive",
        });
        
        // Fall back to demo services if fetch fails or no services are associated with the machine
        setServices([
          {
            id: "S1001",
            name: "Preventive Maintenance - Basic",
            category: "Maintenance",
            parts_cost: 350,
            labor_cost: 250,
            consumables_cost: 100,
            interval_type: "hours",
            interval_value: 500,
          },
          {
            id: "S1002",
            name: "Preventive Maintenance - Advanced",
            category: "Maintenance",
            parts_cost: 750,
            labor_cost: 500,
            consumables_cost: 250,
            interval_type: "months",
            interval_value: 3,
          },
          {
            id: "S1003",
            name: "Equipment Insurance - Standard",
            category: "Insurance",
            parts_cost: 0,
            labor_cost: 0,
            consumables_cost: 0,
            interval_type: "months",
            interval_value: 1,
            fixed_cost: 350,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedMachineId) {
      fetchServices();
    } else {
      setServices([]);
      setIsLoading(false);
    }
  }, [user, toast, selectedMachineId]);

  const selectedServices = data.selectedServiceIds || [];
  
  const toggleService = (serviceId: string) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id: string) => id !== serviceId)
      : [...selectedServices, serviceId];
    
    const selectedServiceObjects = services.filter(s => updatedServices.includes(s.id));
    const timeHorizon = data.timeHorizon || 36;
    const intensityHours = data.intensityHours || 2000;
    
    let totalServiceCost = 0;
    const allServiceEvents = [];
    
    for (const service of selectedServiceObjects) {
      let serviceCost = 0;
      
      if (service.category === "Insurance") {
        serviceCost = (service.fixed_cost || 0) * timeHorizon;
      } else {
        const serviceIntervalHours = service.interval_type === "hours" ? service.interval_value : null;
        const serviceIntervalMonths = service.interval_type === "months" ? service.interval_value : null;
        
        const events = calculateServiceEvents(
          intensityHours,
          timeHorizon / 12,
          serviceIntervalHours || 0,
          serviceIntervalMonths,
          service.parts_cost,
          service.labor_cost,
          service.consumables_cost
        );
        
        allServiceEvents.push(...events);
        
        events.forEach(event => {
          serviceCost += event.cost;
        });
      }
      
      totalServiceCost += serviceCost;
    }
    
    const baseRate = data.baseRate || 5;
    const servicesPresentValue = allServiceEvents.length > 0 
      ? calculateServicePresentValue(allServiceEvents, baseRate) 
      : totalServiceCost;
    
    updateData({ 
      selectedServiceIds: updatedServices,
      serviceEvents: allServiceEvents,
      totalServiceCost,
      servicesPresentValue
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">Loading services...</span>
        </div>
      </div>
    );
  }

  if (!selectedMachineId) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">Please select a machine first</h3>
        <p className="text-muted-foreground mb-4">
          You need to select a machine in the previous step before you can choose services.
        </p>
      </div>
    );
  }

  if (services.length === 1) {
    // Only the insurance service is available, no machine-specific services
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
          <h3 className="text-amber-800 font-medium">No machine-specific services found</h3>
          <p className="text-amber-700 text-sm mt-1">
            No maintenance services are associated with this machine in your service catalog.
            You may want to <Button variant="link" className="h-auto p-0" onClick={() => window.open('/services', '_blank')}>add services to your catalog</Button> first.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {services.map(service => (
            <ServiceCard 
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onToggle={() => toggleService(service.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {services.map(service => (
          <ServiceCard 
            key={service.id}
            service={service}
            isSelected={selectedServices.includes(service.id)}
            onToggle={() => toggleService(service.id)}
          />
        ))}
      </div>

      {selectedServices.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle>Selected Services Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Number of Services:</span>
                <span className="font-medium">{selectedServices.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Service Cost:</span>
                <span className="font-medium">
                  ${data.totalServiceCost ? data.totalServiceCost.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Present Value of Services:</span>
                <span className="font-medium">
                  ${data.servicesPresentValue ? data.servicesPresentValue.toLocaleString(undefined, {maximumFractionDigits: 2}) : "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onToggle }) => {
  return (
    <Card 
      className={`transition-colors ${
        isSelected 
          ? "border-primary border-2" 
          : "border-border"
      }`}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <CardDescription>Category: {service.category}</CardDescription>
        </div>
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {service.category === "Maintenance" && (
            <>
              <div className="flex justify-between text-sm">
                <span>Parts Cost:</span>
                <span>${service.parts_cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor Cost:</span>
                <span>${service.labor_cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Consumables Cost:</span>
                <span>${service.consumables_cost}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Interval:</span>
                <span>
                  Every {service.interval_value} {service.interval_type}
                </span>
              </div>
            </>
          )}
          
          {service.category === "Insurance" && (
            <div className="flex justify-between text-sm font-medium">
              <span>Monthly Cost:</span>
              <span>${service.fixed_cost}/month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelectionStep;
