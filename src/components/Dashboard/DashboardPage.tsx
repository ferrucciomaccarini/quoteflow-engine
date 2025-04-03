
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Quotes</CardTitle>
            <CardDescription>All time quotes created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Open Quotes</CardTitle>
            <CardDescription>Pending approval or review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Quotes to contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">Recent Quotes</TabsTrigger>
          <TabsTrigger value="machines">Machine Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quotes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quote Activity</CardTitle>
              <CardDescription>Latest quotes created in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No recent quotes to display.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="machines" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Machine Utilization</CardTitle>
              <CardDescription>Equipment usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No machine usage data available.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
