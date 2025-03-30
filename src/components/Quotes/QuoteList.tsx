
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample quotes data
const initialQuotes = [
  {
    id: "Q1001",
    customerName: "ABC Manufacturing",
    machineName: "Industrial Press XL-5000",
    totalFee: 1250,
    contractDuration: 36,
    createdAt: "2023-11-15",
    status: "Approved"
  },
  {
    id: "Q1002",
    customerName: "GlobalTech Industries",
    machineName: "Robotic Arm System R-200",
    totalFee: 1850,
    contractDuration: 48,
    createdAt: "2023-11-12",
    status: "Pending"
  },
  {
    id: "Q1003", 
    customerName: "EastCoast Fabrication",
    machineName: "CNC Machine T-3000",
    totalFee: 1420,
    contractDuration: 24,
    createdAt: "2023-11-10",
    status: "Draft"
  },
  {
    id: "Q1004", 
    customerName: "Southwest Materials",
    machineName: "Industrial Press XL-5000",
    totalFee: 1150,
    contractDuration: 36,
    createdAt: "2023-11-05",
    status: "Approved"
  },
  {
    id: "Q1005", 
    customerName: "Northern Tools Co",
    machineName: "CNC Machine T-3000",
    totalFee: 1310,
    contractDuration: 24,
    createdAt: "2023-11-01",
    status: "Rejected"
  }
];

const QuoteList = () => {
  const [quotes] = useState(initialQuotes);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuotes = quotes.filter(
    quote => 
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quoteColumns = [
    { 
      header: "Quote ID", 
      accessorKey: "id",
      cell: (row: any) => (
        <Link to={`/quotes/${row.id}`} className="text-primary font-medium hover:underline">
          {row.id}
        </Link>
      )
    },
    { header: "Customer", accessorKey: "customerName" },
    { header: "Equipment", accessorKey: "machineName" },
    { 
      header: "Monthly Fee", 
      accessorKey: "totalFee",
      cell: (row: any) => `$${row.totalFee.toLocaleString()}`
    },
    { 
      header: "Duration", 
      accessorKey: "contractDuration",
      cell: (row: any) => `${row.contractDuration} months`
    },
    { 
      header: "Created", 
      accessorKey: "createdAt",
      cell: (row: any) => new Date(row.createdAt).toLocaleDateString()
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row: any) => (
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
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/quotes/${row.id}`}>
              <FileText className="mr-1" size={14} />
              View
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-1" size={14} />
            PDF
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600">
            Manage your Equipment as a Service quotes
          </p>
        </div>
        <Button asChild>
          <Link to="/quotes/new">
            <Plus className="mr-2" size={18} />
            New Quote
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Quote Management</CardTitle>
            <CardDescription>View and manage all your quotes</CardDescription>
          </div>
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent>
          <DataTable columns={quoteColumns} data={filteredQuotes} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Quotes
              </CardTitle>
              <Calendar size={18} className="text-muted-foreground" />
            </div>
            <CardDescription className="text-2xl font-bold">
              {quotes.filter(q => q.status === "Pending").length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Waiting for approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved Quotes
              </CardTitle>
              <Calendar size={18} className="text-muted-foreground" />
            </div>
            <CardDescription className="text-2xl font-bold">
              {quotes.filter(q => q.status === "Approved").length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Ready to be converted to contracts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quote Value
              </CardTitle>
              <Calendar size={18} className="text-muted-foreground" />
            </div>
            <CardDescription className="text-2xl font-bold">
              ${quotes.reduce((sum, quote) => sum + quote.totalFee, 0).toLocaleString()} / month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across all active quotes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteList;
