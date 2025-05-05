
import { useState, useEffect } from "react";
import { 
  Users, Bell, Calendar, MessageCircle, Activity, 
  Thermometer, Heart, Droplets, Clock, Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usePremium } from "@/contexts/PremiumContext";
import { useNavigate } from "react-router-dom";

// Dados mockados para estatísticas
const patientData = {
  count: 4,
  alerts: 2,
  appointments: 3
};

// Dados mockados para gráficos e estatísticas - serão substituídos por dados reais
const generateVitalSignsData = () => {
  const times = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  return times.map(time => ({
    name: time,
    bloodPressure: Math.floor(Math.random() * 10) + 115,
    heartRate: Math.floor(Math.random() * 10) + 70, 
    temperature: 36 + (Math.random() * 1).toFixed(1)
  }));
};

// Agendamentos básicos para plano free
const basicAppointments = [
  { id: 1, patient: "Maria Oliveira", time: "Hoje, 14:30", type: "Visita de rotina" },
  { id: 2, patient: "Carlos Mendes", time: "Amanhã, 10:00", type: "Troca de curativo" }
];

// Alertas básicos para plano free
const basicAlerts = [
  { id: 1, message: "Carlos Mendes - Pressão arterial elevada", time: "Há 35 min", severity: "high" },
  { id: 2, message: "José Santos - Medicamento não administrado", time: "Há 2h", severity: "medium" }
];

const Dashboard = () => {
  const [activeChart, setActiveChart] = useState("bloodPressure");
  const [vitalSignsData, setVitalSignsData] = useState([]);
  const { currentPlan, features, isPremiumFeature } = usePremium();
  const navigate = useNavigate();

  useEffect(() => {
    // Simular carregamento de dados dos pacientes
    setVitalSignsData(generateVitalSignsData());
  }, []);

  // Determine os dados baseados no plano
  const isDashboardPremium = isPremiumFeature("advancedDashboard");
  const upcomingAppointments = basicAppointments;
  const recentAlerts = basicAlerts;

  return (
    <div className="space-y-6">
      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Users className="h-8 w-8 text-safecare-500 mb-2" />
            <p className="text-2xl font-bold">{patientData.count}</p>
            <p className="text-sm text-gray-500">Pacientes Ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Bell className="h-8 w-8 text-warning-500 mb-2" />
            <p className="text-2xl font-bold">{patientData.alerts}</p>
            <p className="text-sm text-gray-500">Alertas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Calendar className="h-8 w-8 text-success-500 mb-2" />
            <p className="text-2xl font-bold">{patientData.appointments}</p>
            <p className="text-sm text-gray-500">Agendamentos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <MessageCircle className="h-8 w-8 text-safecare-400 mb-2" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-500">Mensagens</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Sinais Vitais */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Tendências de Sinais Vitais</CardTitle>
          <div className="flex space-x-2 pt-2">
            <Button 
              variant={activeChart === "bloodPressure" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("bloodPressure")}
              className={activeChart === "bloodPressure" ? "bg-safecare-600" : ""}
            >
              <Heart className="h-4 w-4 mr-1" /> Pressão
            </Button>
            <Button 
              variant={activeChart === "heartRate" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("heartRate")}
              className={activeChart === "heartRate" ? "bg-safecare-600" : ""}
            >
              <Activity className="h-4 w-4 mr-1" /> Freq. Cardíaca
            </Button>
            <Button 
              variant={activeChart === "temperature" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChart("temperature")}
              className={activeChart === "temperature" ? "bg-safecare-600" : ""}
            >
              <Thermometer className="h-4 w-4 mr-1" /> Temperatura
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={vitalSignsData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke={activeChart === "bloodPressure" ? "#E53935" : 
                        activeChart === "heartRate" ? "#1E88E5" : "#4CAF50"}
                fill={activeChart === "bloodPressure" ? "#FFCDD2" : 
                      activeChart === "heartRate" ? "#BBDEFB" : "#C8E6C9"}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Agendamentos próximos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-safecare-600" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
            {isDashboardPremium && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">Agendamentos avançados disponíveis em planos superiores</span>
                <Button 
                  size="sm" 
                  className="ml-auto bg-safecare-600 hover:bg-safecare-700" 
                  onClick={() => navigate("/plans")}
                >
                  Upgrade
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2 text-warning-500" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className={`h-2 w-2 mt-2 rounded-full ${
                    alert.severity === "high" ? "bg-danger-500" : 
                    alert.severity === "medium" ? "bg-warning-500" : "bg-success-500"
                  } animate-pulse-slow`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {isDashboardPremium && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">Sistema de alertas avançado disponível em planos superiores</span>
                <Button 
                  size="sm" 
                  className="ml-auto bg-safecare-600 hover:bg-safecare-700"
                  onClick={() => navigate("/plans")}
                >
                  Upgrade
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
