
import MainLayout from "@/components/MainLayout";
import PatientsList from "@/components/PatientsList";

const PatientsPage = () => {
  return (
    <MainLayout title="Gerenciamento de Pacientes">
      <PatientsList />
    </MainLayout>
  );
};

export default PatientsPage;
