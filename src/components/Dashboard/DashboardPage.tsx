
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "../common/Logo";

interface Quote {
  id: string;
  customer_name: string;
  machine_name: string;
  total_fee: number;
  created_at: string;
  status: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [machineCount, setMachineCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch recent quotes
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (quotesError) throw quotesError;
        setRecentQuotes(quotesData || []);
        
        // Get quote count
        const { count: quoteCountResult, error: quoteCountError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (quoteCountError) throw quoteCountError;
        setQuoteCount(quoteCountResult || 0);

        // Get machine count
        const { count: machineCountResult, error: machineCountError } = await supabase
          .from('machines')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (machineCountError) throw machineCountError;
        setMachineCount(machineCountResult || 0);

        // Calculate monthly revenue (sum of all quote fees)
        const { data: revenueData, error: revenueError } = await supabase
          .from('quotes')
          .select('total_fee')
          .eq('user_id', user.id)
          .eq('status', 'Approved');

        if (revenueError) throw revenueError;
        const totalRevenue = revenueData?.reduce((sum, quote) => sum + (quote.total_fee || 0), 0) || 0;
        setMonthlyRevenue(totalRevenue);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const quoteColumns = [
    { header: "Quote ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customer_name" },
    { header: "Equipment", accessorKey: "machine_name" },
    { 
      header: "Amount", 
      accessorKey: "total_fee",
      cell: (row: any) => `$${parseFloat(row.total_fee).toLocaleString()}`
    },
    { 
      header: "Date", 
      accessorKey: "created_at",
      cell: (row: any) => new Date(row.created_at).toLocaleDateString()
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row: any) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.status === "Approved" ? "bg-green-100 text-green-800" :
          row.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quotes/${row.id}`}>
              <FileText className="mr-1" size={14} />
              View
            </Link>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Add Logo at the top center */}
      <div className="mb-6">
        <Logo className="mb-6" />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <Button asChild>
          <Link to="/quotes/new">
            <Plus className="mr-2" size={18} />
            New Quote
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Quotes
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {quoteCount}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `Total quotes in the system`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Machinery
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {machineCount}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `Machines registered in the catalog`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              ${monthlyRevenue.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `Based on approved quotes`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
          <CardDescription>
            Your most recent quote activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : recentQuotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quotes yet</p>
              <Button asChild>
                <Link to="/quotes/new">
                  <Plus className="mr-2" size={18} />
                  Create Your First Quote
                </Link>
              </Button>
            </div>
          ) : (
            <DataTable columns={quoteColumns} data={recentQuotes} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
