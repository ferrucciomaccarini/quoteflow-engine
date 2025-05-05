
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CustomerCatalog from "@/components/Catalog/CustomerCatalog";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="mb-4 text-center">Please log in to view and manage your customers.</p>
            <Button onClick={() => navigate('/login')}>
              Login
            </Button>
          </CardContent>
        </Card>
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
