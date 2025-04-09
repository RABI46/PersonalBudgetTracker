import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { calculateHealthBenefits } from "@/lib/calculate-benefits";

interface HealthBenefitsProps {
  userId: number;
  daysSinceSmoking: number;
}

interface BenefitItemProps {
  title: string;
  description: string;
  status: "achieved" | "upcoming" | "inProgress";
}

function BenefitItem({ title, description, status }: BenefitItemProps) {
  const getStatusColor = () => {
    switch (status) {
      case "achieved":
        return "bg-emerald-400";
      case "inProgress":
        return "bg-blue-400";
      case "upcoming":
        return "bg-gray-400";
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></span>
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <div className="ml-5">
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function HealthBenefits({ userId, daysSinceSmoking }: HealthBenefitsProps) {
  const [, setLocation] = useLocation();

  // Calculate health benefits based on days since smoking
  const benefits = calculateHealthBenefits(daysSinceSmoking);
  
  // Get a few benefits to display (3 max)
  const displayBenefits = [
    ...benefits.achieved.slice(-2), // Last 2 achieved
    ...benefits.upcoming.slice(0, 1) // First upcoming
  ].slice(0, 3);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Bénéfices pour la santé</h2>
      
      {displayBenefits.map((benefit, index) => (
        <BenefitItem
          key={index}
          title={benefit.title}
          description={benefit.description}
          status={
            benefit.days <= daysSinceSmoking 
              ? "achieved" 
              : benefit.days - daysSinceSmoking <= 15 
                ? "inProgress" 
                : "upcoming"
          }
        />
      ))}
      
      <button 
        className="mt-4 text-blue-600 text-sm font-medium flex items-center"
        onClick={() => setLocation('/tips')}
      >
        Voir tous les bénéfices
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
}
