
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NewPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: any) => void;
}

const NewPatientForm = ({ isOpen, onClose, onAddPatient }: NewPatientFormProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !condition) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Criar um novo paciente com valores padrão para os outros campos
    const newPatient = {
      id: `${Date.now()}`, // ID temporário baseado no timestamp
      name,
      age: parseInt(age),
      condition,
      lastCheck: "Hoje",
      status: "stable",
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: "75",
        temperature: "36.5",
        bloodGlucose: "100"
      },
      medicationStatus: "up-to-date"
    };

    onAddPatient(newPatient);
    toast({
      title: "Paciente adicionado",
      description: `${name} foi adicionado com sucesso!`
    });

    // Resetar campos e fechar modal
    setName("");
    setAge("");
    setCondition("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do paciente"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Idade"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="condition">Condição</Label>
            <Input
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Ex: Hipertensão, Diabetes"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-safecare-600 hover:bg-safecare-700">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientForm;
