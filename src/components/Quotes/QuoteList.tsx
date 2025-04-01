
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface Quote {
  id: string;
  customer_name: string;
  machine_name: string;
  total_fee: number;
  created_at: string;
  status: string;
}

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  id?: string;
  cell?: (info: any) => React.ReactNode;
}

const QuoteList = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)
          .neq('status', 'risk_assessment') // Skip risk assessments
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setQuotes(data || []);
      } catch (error: any) {
        console.error('Error fetching quotes:', error);
        toast({
          title: "Error",
          description: "Failed to load quotes. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user, toast]);

  // Fix the cell functions to work with the row data directly instead of using getValue()
  const quoteColumns: Column<Quote>[] = [
    { header: "Quote ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customer_name" },
    { header: "Equipment", accessorKey: "machine_name" },
    { 
      header: "Amount", 
      accessorKey: "total_fee",
      cell: (row) => `$${parseFloat(row.total_fee).toLocaleString()}/month`
    },
    { 
      header: "Date", 
      accessorKey: "created_at",
      cell: (row) => new Date(row.created_at).toLocaleDateString()
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.status === "Approved" ? "bg-green-100 text-green-800" :
          row.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
          row.status === "Rejected" ? "bg-red-100 text-red-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Actions",
      id: "actions",
      accessorKey: "id", 
      cell: (row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <span onClick={() => navigate(`/quotes/${row.id}`)}>
              <FileText className="mr-1 h-4 w-4" />
              View
            </span>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-muted-foreground">
            Manage your Equipment as a Service (EaaS) quotes
          </p>
        </div>
        <Button onClick={() => navigate("/quotes/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>View and manage all your quotes</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading quotes...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No quotes found</p>
              <Button onClick={() => navigate("/quotes/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Quote
              </Button>
            </div>
          ) : (
            <DataTable columns={quoteColumns} data={quotes} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteList;
