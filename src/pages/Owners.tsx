import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import OwnerManager from "@/components/Owners/OwnerManager";

const OwnersPage = () => {
  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Owner Management</h1>
        <p className="text-gray-600">
          Manage company owners in the system
        </p>
      </div>
      <OwnerManager />
    </MainLayout>
  );
};

export default OwnersPage;
