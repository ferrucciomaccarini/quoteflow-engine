
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { NavigateFunction } from "react-router-dom";
import { SummaryTabContent, FinancialTabContent, RisksTabContent, CalculationsTabContent } from "./";

interface QuoteDetailsCardProps {
  quote: any;
  navigate: NavigateFunction;
}

const QuoteDetailsCard = ({ quote, navigate }: QuoteDetailsCardProps) => {
  const { customer_name, machine_name, status } = quote;
  
  // Safely access machine value with a null check
  const machineValue = quote.quote_data?.machineValue;
  const formattedMachineValue = machineValue !== null && machineValue !== undefined 
    ? machineValue.toLocaleString() 
    : "0";
  
  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl">Equipment as a Service Quote</CardTitle>
        <CardDescription>
          <span className="font-medium">Customer: {customer_name}</span> · Equipment: {machine_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Customer Information</h3>
            <dl className="grid grid-cols-2 gap-1 text-sm">
              <dt className="text-muted-foreground">Customer:</dt>
              <dd>{customer_name}</dd>
              <dt className="text-muted-foreground">Contact Person:</dt>
              <dd>{quote.quote_data?.contactPerson || "N/A"}</dd>
              <dt className="text-muted-foreground">Annual Usage:</dt>
              <dd>{quote.quote_data?.intensityHours || 0} hours/year</dd>
              <dt className="text-muted-foreground">Daily Shifts:</dt>
              <dd>{quote.quote_data?.dailyShifts || 1}</dd>
              <dt className="text-muted-foreground">Setup Time:</dt>
              <dd>{quote.quote_data?.setupTime || 0} hours</dd>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Equipment Information</h3>
            <dl className="grid grid-cols-2 gap-1 text-sm">
              <dt className="text-muted-foreground">Machine:</dt>
              <dd>{machine_name}</dd>
              <dt className="text-muted-foreground">Value:</dt>
              <dd>${formattedMachineValue}</dd>
            </dl>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4 pt-4">
            <SummaryTabContent quote={quote} />
          </TabsContent>
          
          <TabsContent value="financial" className="pt-4">
            <FinancialTabContent quote={quote} />
          </TabsContent>
          
          <TabsContent value="risks" className="pt-4">
            <RisksTabContent quote={quote} />
          </TabsContent>

          <TabsContent value="calculations" className="pt-4">
            <CalculationsTabContent quote={quote} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between">
        <Button variant="outline" onClick={() => navigate('/quotes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        
        {status === 'Pending' && (
          <div className="flex gap-2">
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button variant="default">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuoteDetailsCard;
