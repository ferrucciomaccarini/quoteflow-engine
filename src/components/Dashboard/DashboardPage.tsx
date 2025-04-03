
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { DataTable, Column } from "@/components/ui/DataTable";

interface QuoteData {
  id: string;
  customer_name: string;
  machine_name: string;
  total_fee: number;
  created_at: string;
  status: string;
}

interface MachineUsageData {
  id: string;
  name: string;
  usage_hours: number;
  efficiency_score: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [quoteCount, setQuoteCount] = useState<number>(0);
  const [openQuoteCount, setOpenQuoteCount] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [recentQuotes, setRecentQuotes] = useState<QuoteData[]>([]);
  const [machineUsage, setMachineUsage] = useState<MachineUsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch quotes count
        const { count: totalCount, error: countError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (countError) throw countError;
        setQuoteCount(totalCount || 0);
        
        // Fetch open quotes count
        const { count: openCount, error: openError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'Pending');
          
        if (openError) throw openError;
        setOpenQuoteCount(openCount || 0);
        
        // Calculate conversion rate
        const { count: approvedCount, error: approvedError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'Approved');
          
        if (approvedError) throw approvedError;
        
        const convRate = totalCount ? Math.round((approvedCount || 0) / totalCount * 100) : 0;
        setConversionRate(convRate);
        
        // Fetch recent quotes
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('id, customer_name, machine_name, total_fee, created_at, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (quotesError) throw quotesError;
        setRecentQuotes(quotesData || []);
        
        // Fetch machine usage data (simulated for now)
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select('id, name')
          .eq('user_id', user.id)
          .limit(5);
          
        if (machinesError) throw machinesError;
        
        const usageData = machinesData?.map(machine => ({
          id: machine.id,
          name: machine.name,
          usage_hours: Math.floor(Math.random() * 1000),
          efficiency_score: Math.floor(Math.random() * 100)
        })) || [];
        
        setMachineUsage(usageData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const quoteColumns: Column<QuoteData>[] = [
    {
      header: "Customer",
      accessorKey: "customer_name"
    },
    {
      header: "Machine",
      accessorKey: "machine_name"
    },
    {
      header: "Amount",
      accessorKey: "total_fee",
      cell: (info) => `$${info.total_fee?.toLocaleString(undefined, {maximumFractionDigits: 2}) || '0.00'}`
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: (info) => new Date(info.created_at).toLocaleDateString()
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full 
          ${info.status === 'Approved' ? 'bg-green-100 text-green-800' : 
            info.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {info.status}
        </span>
      )
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (info) => (
        <Link to={`/quotes/${info.id}`} className="text-primary text-sm hover:underline">
          View
        </Link>
      )
    }
  ];

  const machineColumns: Column<MachineUsageData>[] = [
    {
      header: "Machine Name",
      accessorKey: "name"
    },
    {
      header: "Usage Hours",
      accessorKey: "usage_hours",
      cell: (info) => `${info.usage_hours.toLocaleString()} hrs`
    },
    {
      header: "Efficiency",
      accessorKey: "efficiency_score",
      cell: (info) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              info.efficiency_score > 75 ? 'bg-green-500' : 
              info.efficiency_score > 50 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${info.efficiency_score}%` }}>
          </div>
        </div>
      )
    }
  ];

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
            <div className="text-3xl font-bold">{quoteCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Open Quotes</CardTitle>
            <CardDescription>Pending approval or review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openQuoteCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Quotes to contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
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
              {recentQuotes.length > 0 ? (
                <DataTable
                  columns={quoteColumns}
                  data={recentQuotes}
                  loading={isLoading}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No recent quotes to display.
                </div>
              )}
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
              {machineUsage.length > 0 ? (
                <DataTable
                  columns={machineColumns}
                  data={machineUsage}
                  loading={isLoading}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No machine usage data available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
