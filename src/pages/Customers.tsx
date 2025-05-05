
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CustomerCatalog from "@/components/Catalog/CustomerCatalog";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Customers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be logged in to view and manage customers.
          </p>
          <Button onClick={() => navigate("/login")}>
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <CustomerCatalog />
    </MainLayout>
  );
};

export default Customers;
