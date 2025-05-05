
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/contexts/PremiumContext";
import { useNavigate } from "react-router-dom";

interface PremiumFeatureBlockProps {
  featureKey: keyof ReturnType<typeof usePremium>["features"];
  featureName: string;
  description: string;
}

const PremiumFeatureBlock = ({ featureKey, featureName, description }: PremiumFeatureBlockProps) => {
  const { isPremiumFeature } = usePremium();
  const navigate = useNavigate();
  
  const isLocked = isPremiumFeature(featureKey);

  if (!isLocked) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-300 rounded-md bg-gray-50 min-h-[250px]">
      <Lock className="h-12 w-12 text-safecare-300 mb-4" />
      <h3 className="text-xl font-medium mb-2">{featureName}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Button 
        onClick={() => navigate("/plans")} 
        className="bg-safecare-600 hover:bg-safecare-700"
      >
        Fazer upgrade
      </Button>
    </div>
  );
};

export default PremiumFeatureBlock;
