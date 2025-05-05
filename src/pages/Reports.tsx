
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import PremiumFeatureBlock from "@/components/PremiumFeatureBlock";
import { usePremium } from "@/contexts/PremiumContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ptBR } from "date-fns/locale";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { FileText, Download, Users, Pill, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo para gráficos
const mockPatientData = [
  { name: "Jan", novos: 12, retorno: 8 },
  { name: "Fev", novos: 19, retorno: 10 },
  { name: "Mar", novos: 15, retorno: 12 },
  { name: "Abr", novos: 25, retorno: 15 },
  { name: "Mai", novos: 22, retorno: 20 },
  { name: "Jun", novos: 30, retorno: 22 },
];

const mockMedicationData = [
  { name: "Anlodipino", quantidade: 45 },
  { name: "Atenolol", quantidade: 32 },
  { name: "Sinvastatina", quantidade: 27 },
  { name: "Metformina", quantidade: 20 },
  { name: "Omeprazol", quantidade: 18 },
];

const mockAppointmentData = eachDayOfInterval({
  start: startOfMonth(new Date()),
  end: endOfMonth(new Date()),
}).map(date => ({
  date: format(date, "dd/MM"),
  agendados: Math.floor(Math.random() * 10),
  realizados: Math.floor(Math.random() * 8),
}));

const ReportsPage = () => {
  const { isPremiumFeature } = usePremium();
  const { toast } = useToast();
  const isLocked = isPremiumFeature("reports");
  
  const [reportType, setReportType] = useState("patients");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  
  const handleExportReport = () => {
    toast({
      title: "Exportando relatório",
      description: `O relatório de ${
        reportType === "patients" ? "pacientes" : 
        reportType === "medications" ? "medicamentos" : "agendamentos"
      } será exportado em breve.`
    });
  };

  return (
    <MainLayout title="Relatórios">
      {isLocked ? (
        <PremiumFeatureBlock 
          featureKey="reports"
          featureName="Relatórios Avançados"
          description="Acesse relatórios detalhados e personalizáveis sobre pacientes e medicamentos. Disponível nos planos Profissional e Empresarial."
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Personalize seu relatório</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="reportType" className="block text-sm font-medium mb-1">
                    Tipo de Relatório
                  </label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="reportType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patients">Pacientes</SelectItem>
                      <SelectItem value="medications">Medicamentos</SelectItem>
                      <SelectItem value="appointments">Agendamentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Período
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">De:</p>
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                        className="rounded-md border w-full"
                        locale={ptBR}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Até:</p>
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                        className="rounded-md border w-full"
                        locale={ptBR}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" /> Exportar Relatório
              </Button>
            </CardContent>
          </Card>
          
          <Tabs defaultValue={reportType} value={reportType} onValueChange={setReportType}>
            <TabsList className="mb-4">
              <TabsTrigger value="patients">
                <Users className="h-4 w-4 mr-2" /> Pacientes
              </TabsTrigger>
              <TabsTrigger value="medications">
                <Pill className="h-4 w-4 mr-2" /> Medicamentos
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <CalendarIcon className="h-4 w-4 mr-2" /> Agendamentos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" /> Relatório de Pacientes
                  </CardTitle>
                  <CardDescription>
                    Visão geral dos pacientes entre {format(dateRange.from, "dd/MM/yyyy")} e {format(dateRange.to, "dd/MM/yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockPatientData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="novos" name="Novos Pacientes" fill="#4FD1C5" />
                        <Bar dataKey="retorno" name="Pacientes de Retorno" fill="#63B3ED" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Total de Pacientes</h4>
                        <p className="text-3xl font-bold mt-2">123</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Média de Idade</h4>
                        <p className="text-3xl font-bold mt-2">42 anos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="medications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="h-5 w-5 mr-2" /> Relatório de Medicamentos
                  </CardTitle>
                  <CardDescription>
                    Visão geral dos medicamentos entre {format(dateRange.from, "dd/MM/yyyy")} e {format(dateRange.to, "dd/MM/yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={mockMedicationData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 60,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantidade" name="Quantidade Prescrita" fill="#F687B3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Total de Medicamentos</h4>
                        <p className="text-3xl font-bold mt-2">142</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Medicamento Mais Receitado</h4>
                        <p className="text-2xl font-bold mt-2">Anlodipino</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" /> Relatório de Agendamentos
                  </CardTitle>
                  <CardDescription>
                    Visão geral dos agendamentos entre {format(dateRange.from, "dd/MM/yyyy")} e {format(dateRange.to, "dd/MM/yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockAppointmentData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="agendados" name="Agendamentos" stroke="#805AD5" />
                        <Line type="monotone" dataKey="realizados" name="Consultas Realizadas" stroke="#38B2AC" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Total de Agendamentos</h4>
                        <p className="text-3xl font-bold mt-2">86</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Consultas Realizadas</h4>
                        <p className="text-3xl font-bold mt-2">64</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium">Taxa de Comparecimento</h4>
                        <p className="text-3xl font-bold mt-2">74%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" /> Relatórios Salvos
              </CardTitle>
              <CardDescription>Acesse relatórios gerados anteriormente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-safecare-500" />
                    <div>
                      <p className="font-medium">Relatório Mensal - Pacientes</p>
                      <p className="text-sm text-muted-foreground">01/03/2025 - 31/03/2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-safecare-500" />
                    <div>
                      <p className="font-medium">Relatório Trimestral - Medicamentos</p>
                      <p className="text-sm text-muted-foreground">01/01/2025 - 31/03/2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default ReportsPage;
