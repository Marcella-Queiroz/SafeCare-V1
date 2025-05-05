
import { CheckCircle2 } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePremium, planPrices, PlanType } from "@/contexts/PremiumContext";
import { useToast } from "@/hooks/use-toast";

const PlanFeature = ({ included, children }: { included: boolean; children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    {included ? <CheckCircle2 className="h-4 w-4 text-success-500" /> : <div className="w-4" />}
    <span className={included ? "text-gray-700" : "text-gray-400"}>{children}</span>
  </div>
);

const PlansPage = () => {
  const { currentPlan, upgradePlan } = usePremium();
  const { toast } = useToast();

  const plans = [
    {
      id: "free",
      name: "Gratuito",
      description: "Para pequenos cuidadores individuais",
      price: 0,
      features: [
        { text: "Até 5 pacientes", included: true },
        { text: "Gerenciamento básico de pacientes", included: true },
        { text: "Dashboard simplificado", included: true },
        { text: "Gestão básica de medicamentos", included: false },
        { text: "Agendamento avançado", included: false },
        { text: "Sistema de mensagens", included: false },
        { text: "Relatórios personalizáveis", included: false },
      ],
    },
    {
      id: "basic",
      name: "Básico",
      description: "Para cuidadores individuais",
      price: 39.90,
      features: [
        { text: "Até 20 pacientes", included: true },
        { text: "Gerenciamento básico de pacientes", included: true },
        { text: "Dashboard simplificado", included: true },
        { text: "Gestão básica de medicamentos", included: true },
        { text: "Agendamento avançado", included: false },
        { text: "Sistema de mensagens", included: false },
        { text: "Relatórios personalizáveis", included: false },
      ],
    },
    {
      id: "professional",
      name: "Profissional",
      description: "Para pequenas equipes de cuidado",
      price: 99.90,
      features: [
        { text: "Até 50 pacientes", included: true },
        { text: "Gerenciamento avançado de pacientes", included: true },
        { text: "Dashboard avançado", included: true },
        { text: "Gestão completa de medicamentos", included: true },
        { text: "Agendamento avançado", included: true },
        { text: "Sistema de mensagens", included: true },
        { text: "Relatórios básicos", included: true },
      ],
    },
    {
      id: "enterprise",
      name: "Empresarial",
      description: "Para clínicas e grandes equipes",
      price: 299.90,
      features: [
        { text: "Pacientes ilimitados", included: true },
        { text: "Gerenciamento avançado de pacientes", included: true },
        { text: "Dashboard personalizado", included: true },
        { text: "Gestão completa de medicamentos", included: true },
        { text: "Agendamento avançado", included: true },
        { text: "Sistema de mensagens avançado", included: true },
        { text: "Relatórios personalizáveis", included: true },
      ],
    },
  ];

  const handleUpgrade = (plan: PlanType) => {
    upgradePlan(plan);
    toast({
      title: "Plano atualizado",
      description: `Você agora está usando o plano ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
    });
  };

  return (
    <MainLayout title="Planos e Preços">
      <div className="space-y-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Escolha o melhor plano para sua necessidade</h2>
          <p className="text-gray-500">
            Oferecemos diferentes opções para atender às necessidades da sua equipe de cuidados.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={
                currentPlan === plan.id 
                  ? "border-2 border-safecare-600 shadow-lg" 
                  : "border border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}`}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-gray-500 ml-1">/mês</span>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {plan.features.map((feature, index) => (
                    <PlanFeature key={index} included={feature.included}>
                      {feature.text}
                    </PlanFeature>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={currentPlan === plan.id ? "outline" : "default"}
                  disabled={currentPlan === plan.id}
                  onClick={() => handleUpgrade(plan.id as PlanType)}
                >
                  {currentPlan === plan.id ? "Plano Atual" : "Escolher Plano"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PlansPage;
