
import { useState } from "react";
import { Search, Plus, Clock, Check, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Dados mockados para exemplo
const mockMedications = [
  {
    id: "1",
    name: "Losartana Potássica",
    dosage: "50mg",
    frequency: "1x ao dia - 8:00",
    patient: "Maria Oliveira",
    status: "scheduled",
    nextDose: "Hoje, 8:00",
    instructions: "Tomar com água, após o café da manhã"
  },
  {
    id: "2",
    name: "Metformina",
    dosage: "850mg",
    frequency: "2x ao dia - 8:00, 20:00",
    patient: "Maria Oliveira",
    status: "given",
    nextDose: "Hoje, 20:00",
    instructions: "Tomar durante as refeições"
  },
  {
    id: "3",
    name: "Enalapril",
    dosage: "10mg",
    frequency: "2x ao dia - 8:00, 20:00",
    patient: "José Santos",
    status: "missed",
    nextDose: "Hoje, 8:00 (atrasado)",
    instructions: "Tomar com estômago vazio"
  },
  {
    id: "4",
    name: "Atorvastatina",
    dosage: "20mg",
    frequency: "1x ao dia - 20:00",
    patient: "José Santos",
    status: "scheduled",
    nextDose: "Hoje, 20:00",
    instructions: "Tomar à noite, antes de dormir"
  },
  {
    id: "5",
    name: "Paracetamol",
    dosage: "750mg",
    frequency: "A cada 6h, se necessário",
    patient: "Ana Costa",
    status: "as-needed",
    nextDose: "Quando necessário",
    instructions: "Em caso de dor ou febre"
  }
];

const MedicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medications, setMedications] = useState(mockMedications);
  const [activeTab, setActiveTab] = useState("all");

  const filteredMedications = medications.filter(med => {
    // Filtra por termo de busca
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.patient.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtra por tab ativa
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "scheduled") return matchesSearch && med.status === "scheduled";
    if (activeTab === "given") return matchesSearch && med.status === "given";
    if (activeTab === "missed") return matchesSearch && med.status === "missed";
    
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-5 w-5 text-safecare-500" />;
      case "given":
        return <Check className="h-5 w-5 text-success-500" />;
      case "missed":
        return <AlertTriangle className="h-5 w-5 text-danger-500" />;
      case "as-needed":
        return <Clock className="h-5 w-5 text-warning-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-safecare-100 text-safecare-800 hover:bg-safecare-200">Agendado</Badge>;
      case "given":
        return <Badge className="bg-success-100 text-success-800 hover:bg-success-200">Administrado</Badge>;
      case "missed":
        return <Badge className="bg-danger-100 text-danger-800 hover:bg-danger-200">Não administrado</Badge>;
      case "as-needed":
        return <Badge className="bg-warning-100 text-warning-800 hover:bg-warning-200">Se necessário</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const handleMarkAsGiven = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, status: "given" } : med
    ));
  };

  const handleMarkAsMissed = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, status: "missed" } : med
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar medicamentos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-safecare-600 hover:bg-safecare-700">
          <Plus className="h-4 w-4 mr-2" /> Novo Medicamento
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="scheduled">Agendados</TabsTrigger>
          <TabsTrigger value="given">Administrados</TabsTrigger>
          <TabsTrigger value="missed">Não Administrados</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4">
            {filteredMedications.map((medication) => (
              <Card key={medication.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(medication.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{medication.name} {medication.dosage}</h3>
                          {getStatusBadge(medication.status)}
                        </div>
                        <p className="text-sm text-gray-500">{medication.patient} - {medication.frequency}</p>
                        <p className="text-xs mt-1">{medication.instructions}</p>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1">
                      <div className="text-sm font-medium">
                        {medication.nextDose}
                      </div>
                      
                      {medication.status === "scheduled" && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-success-500 text-success-600 hover:bg-success-50"
                            onClick={() => handleMarkAsGiven(medication.id)}
                          >
                            <Check className="h-3 w-3 mr-1" /> Dado
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-danger-500 text-danger-600 hover:bg-danger-50"
                            onClick={() => handleMarkAsMissed(medication.id)}
                          >
                            <X className="h-3 w-3 mr-1" /> Não dado
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationManagement;
