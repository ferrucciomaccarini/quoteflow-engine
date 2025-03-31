
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CreditBureauSpreadManager from "@/components/Spreads/CreditBureauSpreadManager";
import { useAuth } from "@/context/AuthContext";

const CreditBureauSpreadsPage = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Credit Bureau Spreads</h1>
        <p className="text-gray-600">
          Manage your credit bureau spread rates for {user?.companyName}
        </p>
      </div>
      <CreditBureauSpreadManager />
    </MainLayout>
  );
};

export default CreditBureauSpreadsPage;
