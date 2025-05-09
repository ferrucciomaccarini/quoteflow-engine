
import MachineCatalog from "@/components/Catalog/MachineCatalog";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Machines = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto">
        <MachineCatalog />
      </div>
    </MainLayout>
  );
};

export default Machines;
