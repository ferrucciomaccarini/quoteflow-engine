import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Impostazioni</h1>
            <p className="text-muted-foreground">Gestisci le impostazioni dell'applicazione</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Modalità Demo</CardTitle>
              <CardDescription>
                L'app è in modalità demo - tutti i dati sono pubblici
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Questa è una versione demo dell'applicazione EaaS Portal.</p>
                <p className="mt-2">Tutti i dati sono accessibili senza autenticazione.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
