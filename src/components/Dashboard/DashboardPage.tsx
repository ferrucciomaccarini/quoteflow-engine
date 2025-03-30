
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const [recentQuotes] = useState([
    {
      id: "Q1001",
      customer: "ABC Manufacturing",
      equipment: "Industrial Press XL-5000",
      amount: 12500,
      date: "2023-11-15",
      status: "Approved"
    },
    {
      id: "Q1002",
      customer: "GlobalTech Industries",
      equipment: "Robotic Arm System R-200",
      amount: 7800,
      date: "2023-11-12",
      status: "Pending"
    },
    {
      id: "Q1003", 
      customer: "EastCoast Fabrication",
      equipment: "CNC Machine T-3000",
      amount: 9200,
      date: "2023-11-10",
      status: "Draft"
    }
  ]);

  const quoteColumns = [
    { header: "Quote ID", accessorKey: "id" },
    { header: "Customer", accessorKey: "customer" },
    { header: "Equipment", accessorKey: "equipment" },
    { 
      header: "Amount", 
      accessorKey: "amount",
      cell: (row: any) => `$${row.amount.toLocaleString()}`
    },
    { 
      header: "Date", 
      accessorKey: "date",
      cell: (row: any) => new Date(row.date).toLocaleDateString()
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}
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
              12
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +2 since last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Machinery
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              24
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +5 since last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              $34,500
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +12% from last month
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
          <DataTable columns={quoteColumns} data={recentQuotes} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
