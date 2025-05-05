
import React, { createContext, useContext, useState, useEffect } from "react";

// Definição dos tipos de plano
export type PlanType = "free" | "basic" | "professional" | "enterprise";

// Interface para as permissões
export interface PremiumFeatures {
  maxPatients: number;
  advancedDashboard: boolean;
  advancedMedications: boolean;
  advancedAppointments: boolean;
  messaging: boolean;
  reports: boolean;
  integrations: boolean;
}

// Mapeamento de planos para permissões
const planFeatures: Record<PlanType, PremiumFeatures> = {
  free: {
    maxPatients: 5,
    advancedDashboard: false,
    advancedMedications: false,
    advancedAppointments: false,
    messaging: false,
    reports: false,
    integrations: false
  },
  basic: {
    maxPatients: 20,
    advancedDashboard: false,
    advancedMedications: true,
    advancedAppointments: false,
    messaging: false,
    reports: false,
    integrations: false
  },
  professional: {
    maxPatients: 50,
    advancedDashboard: true,
    advancedMedications: true,
    advancedAppointments: true,
    messaging: true,
    reports: true,
    integrations: false
  },
  enterprise: {
    maxPatients: Infinity,
    advancedDashboard: true,
    advancedMedications: true,
    advancedAppointments: true,
    messaging: true,
    reports: true,
    integrations: true
  }
};

// Preços dos planos
export const planPrices = {
  free: 0,
  basic: 39.90,
  professional: 99.90,
  enterprise: 299.90
};

interface PremiumContextType {
  currentPlan: PlanType;
  features: PremiumFeatures;
  upgradePlan: (plan: PlanType) => void;
  isPremiumFeature: (feature: keyof PremiumFeatures) => boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>(() => {
    const savedPlan = localStorage.getItem("safecare-plan");
    return (savedPlan as PlanType) || "free";
  });

  const features = planFeatures[currentPlan];

  const upgradePlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    localStorage.setItem("safecare-plan", plan);
  };

  const isPremiumFeature = (feature: keyof PremiumFeatures) => {
    return !features[feature];
  };

  return (
    <PremiumContext.Provider value={{ currentPlan, features, upgradePlan, isPremiumFeature }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
}
