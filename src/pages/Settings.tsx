
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Impostazioni</h1>
            <p className="text-muted-foreground">Gestisci le tue preferenze account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informazioni Account</CardTitle>
              <CardDescription>
                Le tue informazioni di base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <p className="text-sm text-muted-foreground">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Ruolo</label>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Azienda</label>
                  <p className="text-sm text-muted-foreground">{user?.companyName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
