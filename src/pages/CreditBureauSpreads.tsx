import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CreditBureauSpreadManager from "@/components/Spreads/CreditBureauSpreadManager";

const CreditBureauSpreadsPage = () => {
  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Credit Bureau Spreads</h1>
        <p className="text-gray-600">
          Manage your credit bureau spread rates
        </p>
      </div>
      <CreditBureauSpreadManager />
    </MainLayout>
  );
};

export default CreditBureauSpreadsPage;
