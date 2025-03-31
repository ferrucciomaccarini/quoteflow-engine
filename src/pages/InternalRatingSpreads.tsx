
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import InternalRatingSpreadManager from "@/components/Spreads/InternalRatingSpreadManager";
import { useAuth } from "@/context/AuthContext";

const InternalRatingSpreadsPage = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Internal Rating Spreads</h1>
        <p className="text-gray-600">
          Manage your internal rating spread rates for {user?.companyName}
        </p>
      </div>
      <InternalRatingSpreadManager />
    </MainLayout>
  );
};

export default InternalRatingSpreadsPage;
