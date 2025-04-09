import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";

interface DailyTipProps {
  userId?: number;
}

export default function DailyTip({ userId }: DailyTipProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  // Fetch health tips from API
  const { data: healthTips, isLoading } = useQuery({
    queryKey: ['/api/health-tips'],
  });
  
  if (isLoading) {
    return (
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 text-white">
        <p>Chargement des conseils...</p>
      </div>
    );
  }
  
  // Default tip in case API fails
  const defaultTip = {
    title: "Astuce du jour",
    content: "Lorsque vous avez une envie de fumer, essayez la technique de respiration 4-7-8 : inspirez pendant 4 secondes, retenez pendant 7 secondes, expirez pendant 8 secondes. Répétez 3 fois."
  };
  
  const tips = healthTips || [defaultTip];
  const currentTip = tips[currentTipIndex] || defaultTip;
  
  const handleNextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };
  
  return (
    <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 text-white">
      <div className="flex items-start mb-4">
        <div className="p-3 bg-white bg-opacity-20 rounded-full mr-4">
          <Info className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">{currentTip.title}</h2>
          <p className="text-blue-100">{currentTip.content}</p>
        </div>
      </div>
      <button 
        className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors py-2 px-4 rounded-lg"
        onClick={handleNextTip}
      >
        Conseil suivant
      </button>
    </div>
  );
}
