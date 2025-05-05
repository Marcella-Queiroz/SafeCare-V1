
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/contexts/PremiumContext";
import { useNavigate } from "react-router-dom";

interface PatientLimitWarningProps {
  currentCount: number;
}

const PatientLimitWarning = ({ currentCount }: PatientLimitWarningProps) => {
  const { features } = usePremium();
  const navigate = useNavigate();
  
  const isNearLimit = currentCount >= features.maxPatients * 0.8;
  const isAtLimit = currentCount >= features.maxPatients;
  
  if (!isNearLimit && !isAtLimit) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Limite de pacientes</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {isAtLimit ? (
            <span>Você atingiu o limite de {features.maxPatients} pacientes do seu plano atual.</span>
          ) : (
            <span>Você está próximo ao limite de {features.maxPatients} pacientes ({currentCount}/{features.maxPatients}).</span>
          )}
        </div>
        <Button 
          size="sm" 
          onClick={() => navigate("/plans")}
          className="bg-white text-destructive-foreground hover:bg-white/90 border border-destructive"
        >
          Fazer upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default PatientLimitWarning;
