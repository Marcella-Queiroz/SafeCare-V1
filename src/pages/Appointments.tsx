
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import PremiumFeatureBlock from "@/components/PremiumFeatureBlock";
import { usePremium } from "@/contexts/PremiumContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Plus, Trash } from "lucide-react";

// Mock de dados para agendamentos
const mockAppointments = [
  { id: "1", patientName: "Ana Silva", date: new Date(), time: "09:00", type: "Consulta" },
  { id: "2", patientName: "José Santos", date: new Date(Date.now() + 86400000), time: "14:30", type: "Retorno" },
  { id: "3", patientName: "Maria Oliveira", date: new Date(Date.now() + 172800000), time: "11:15", type: "Exame" }
];

const AppointmentsPage = () => {
  const { isPremiumFeature } = usePremium();
  const { toast } = useToast();
  const isLocked = isPremiumFeature("advancedAppointments");
  
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [patientName, setPatientName] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  
  const filteredAppointments = selectedDate 
    ? appointments.filter(app => isSameDay(app.date, selectedDate))
    : appointments;
    
  const handleAddAppointment = () => {
    if (!patientName || !appointmentTime || !appointmentType || !selectedDate) {
      toast({
        title: "Erro ao agendar",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    const newAppointment = {
      id: Date.now().toString(),
      patientName,
      date: selectedDate,
      time: appointmentTime,
      type: appointmentType
    };
    
    setAppointments([...appointments, newAppointment]);
    
    // Limpar o formulário
    setPatientName("");
    setAppointmentTime("");
    setAppointmentType("");
    
    toast({
      title: "Agendamento realizado",
      description: `Consulta para ${patientName} agendada com sucesso.`,
    });
  };
  
  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
    toast({
      title: "Agendamento removido",
      description: "O agendamento foi removido com sucesso."
    });
  };

  return (
    <MainLayout title="Agendamentos">
      {isLocked ? (
        <PremiumFeatureBlock 
          featureKey="advancedAppointments"
          featureName="Agendamentos Avançados"
          description="Gerencie compromissos, configure lembretes automáticos e sincronize com o calendário. Disponível nos planos Profissional e Empresarial."
        />
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="new">Novo Agendamento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      locale={ptBR}
                    />
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? (
                        format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                      ) : (
                        "Selecione uma data"
                      )}
                    </CardTitle>
                    <CardDescription>Agendamentos para esta data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(appointment => (
                          <div key={appointment.id} className="flex items-center justify-between border rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-safecare-500" />
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <div className="flex items-center text-sm text-muted-foreground gap-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  <span className="text-xs bg-safecare-100 text-safecare-700 px-2 py-1 rounded">
                                    {appointment.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          Não há agendamentos para esta data.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Todos os Agendamentos</CardTitle>
                  <CardDescription>Visualize todos os agendamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.length > 0 ? appointments.sort((a, b) => a.date.getTime() - b.date.getTime()).map(appointment => (
                      <div key={appointment.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-safecare-500" />
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <div className="flex items-center text-sm text-muted-foreground gap-3">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{format(appointment.date, "dd/MM/yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.time}</span>
                              </div>
                              <span className="text-xs bg-safecare-100 text-safecare-700 px-2 py-1 rounded">
                                {appointment.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground py-4">
                        Não há agendamentos cadastrados.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle>Novo Agendamento</CardTitle>
                  <CardDescription>Adicione um novo agendamento ao sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="patient" className="block text-sm font-medium mb-1">
                        Nome do Paciente
                      </label>
                      <Input 
                        id="patient" 
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Digite o nome do paciente"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium mb-1">
                        Data
                      </label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        locale={ptBR}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium mb-1">
                        Horário
                      </label>
                      <Input 
                        id="time" 
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium mb-1">
                        Tipo
                      </label>
                      <Input 
                        id="type" 
                        value={appointmentType}
                        onChange={(e) => setAppointmentType(e.target.value)}
                        placeholder="Ex: Consulta, Retorno, Exame"
                      />
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={handleAddAppointment}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Agendamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </MainLayout>
  );
};

export default AppointmentsPage;
