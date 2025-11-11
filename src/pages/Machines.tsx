import MachineCatalog from "@/components/Catalog/MachineCatalog";
import MainLayout from "@/components/Layout/MainLayout";

const Machines = () => {
  
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto">
        <MachineCatalog />
      </div>
    </MainLayout>
  );
};

export default Machines;
