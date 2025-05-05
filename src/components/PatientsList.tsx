
import { useState } from "react";
import { Search, Plus, Heart, Activity, Pill, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePremium } from "@/contexts/PremiumContext";
import PatientLimitWarning from "./PatientLimitWarning";
import { useToast } from "@/hooks/use-toast";
import NewPatientForm from "./NewPatientForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Dados mockados para exemplo
const mockPatients = [
  {
    id: "1",
    name: "Maria Oliveira",
    age: 72,
    condition: "Hipertensão, Diabetes",
    lastCheck: "Hoje, 08:30",
    status: "stable",
    vitalSigns: {
      bloodPressure: "130/85",
      heartRate: "78",
      temperature: "36.5",
      bloodGlucose: "110"
    },
    medicationStatus: "up-to-date"
  },
  {
    id: "2",
    name: "José Santos",
    age: 68,
    condition: "Insuficiência Cardíaca",
    lastCheck: "Ontem, 14:15",
    status: "attention",
    vitalSigns: {
      bloodPressure: "145/90",
      heartRate: "85",
      temperature: "36.8",
      bloodGlucose: "95"
    },
    medicationStatus: "needs-update"
  },
  {
    id: "3",
    name: "Ana Costa",
    age: 81,
    condition: "Alzheimer, Artrite",
    lastCheck: "2 dias atrás",
    status: "stable",
    vitalSigns: {
      bloodPressure: "125/80",
      heartRate: "72",
      temperature: "36.4",
      bloodGlucose: "105"
    },
    medicationStatus: "up-to-date"
  },
  {
    id: "4",
    name: "Carlos Mendes",
    age: 75,
    condition: "Pós-operatório - Quadril",
    lastCheck: "Hoje, 10:45",
    status: "critical",
    vitalSigns: {
      bloodPressure: "160/95",
      heartRate: "92",
      temperature: "37.8",
      bloodGlucose: "145"
    },
    medicationStatus: "needs-update"
  }
];

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState(mockPatients);
  const [isNewPatientFormOpen, setIsNewPatientFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const { features } = usePremium();
  const { toast } = useToast();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return <Badge className="bg-success-500">Estável</Badge>;
      case "attention":
        return <Badge className="bg-warning-500">Atenção</Badge>;
      case "critical":
        return <Badge className="bg-danger-500">Crítico</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const handleAddPatient = () => {
    if (patients.length >= features.maxPatients) {
      toast({
        title: "Limite de pacientes atingido",
        description: `Seu plano atual permite até ${features.maxPatients} pacientes. Faça upgrade para adicionar mais.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsNewPatientFormOpen(true);
  };

  const addPatient = (newPatient: any) => {
    setPatients([...patients, newPatient]);
  };

  const confirmDeletePatient = (id: string) => {
    setPatientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deletePatient = () => {
    if (patientToDelete) {
      const updatedPatients = patients.filter(patient => patient.id !== patientToDelete);
      setPatients(updatedPatients);
      
      // Encontrar o nome do paciente para a mensagem de confirmação
      const patient = patients.find(p => p.id === patientToDelete);
      
      toast({
        title: "Paciente removido",
        description: `${patient?.name || "Paciente"} foi removido com sucesso.`,
      });
      
      setPatientToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PatientLimitWarning currentCount={patients.length} />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar pacientes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          className="bg-safecare-600 hover:bg-safecare-700"
          onClick={handleAddPatient}
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="safecare-card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-lg">{patient.name}</h3>
                <p className="text-sm text-gray-500">{patient.age} anos - {patient.condition}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(patient.status)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-danger-500 hover:bg-danger-50"
                  onClick={() => confirmDeletePatient(patient.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-danger-500" />
                <div>
                  <p className="text-xs text-gray-500">Pressão Arterial</p>
                  <p className="font-medium">{patient.vitalSigns.bloodPressure}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-safecare-500" />
                <div>
                  <p className="text-xs text-gray-500">Frequência Cardíaca</p>
                  <p className="font-medium">{patient.vitalSigns.heartRate} bpm</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-success-500" />
                <span className="text-sm">
                  {patient.medicationStatus === "up-to-date" ? 
                    "Medicação em dia" : 
                    "Atualização necessária"}
                </span>
              </div>
              <p className="text-xs text-gray-500">Última verificação: {patient.lastCheck}</p>
            </div>
          </div>
        ))}
      </div>

      <NewPatientForm 
        isOpen={isNewPatientFormOpen} 
        onClose={() => setIsNewPatientFormOpen(false)} 
        onAddPatient={addPatient} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deletePatient}
              className="bg-danger-500 hover:bg-danger-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PatientsList;
