
import MainLayout from "@/components/MainLayout";
import MedicationManagement from "@/components/MedicationManagement";

const MedicationsPage = () => {
  return (
    <MainLayout title="Gestão de Medicamentos">
      <MedicationManagement />
    </MainLayout>
  );
};

export default MedicationsPage;
