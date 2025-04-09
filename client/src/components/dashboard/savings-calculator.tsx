import { useState } from "react";
import { calculateMoneySaved } from "@/lib/calculate-benefits";
import { DEFAULT_CIGARETTE_PACK_PRICE, DEFAULT_CIGARETTES_PER_PACK } from "@/lib/constants";
import { DollarSign } from "lucide-react";

interface SavingsCalculatorProps {
  daysSinceSmoking: number;
  initialCigarettesPerDay?: number;
}

export default function SavingsCalculator({ 
  daysSinceSmoking, 
  initialCigarettesPerDay = 10 
}: SavingsCalculatorProps) {
  const [cigarettesPerDay, setCigarettesPerDay] = useState(initialCigarettesPerDay);
  const [packPrice, setPackPrice] = useState(DEFAULT_CIGARETTE_PACK_PRICE);
  
  // Calcul des économies
  const moneySaved = calculateMoneySaved(
    cigarettesPerDay,
    packPrice,
    DEFAULT_CIGARETTES_PER_PACK,
    daysSinceSmoking
  );
  
  // Calcul des économies projetées
  const projections = [
    { days: 30, label: "1 mois" },
    { days: 90, label: "3 mois" },
    { days: 365, label: "1 an" }
  ].map(period => ({
    ...period,
    amount: calculateMoneySaved(
      cigarettesPerDay,
      packPrice,
      DEFAULT_CIGARETTES_PER_PACK,
      period.days
    )
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Économies réalisées</h2>
      
      <div className="p-6 bg-green-50 rounded-lg mb-6 flex items-center">
        <div className="p-3 bg-green-100 rounded-full mr-4">
          <DollarSign className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-green-700 font-medium">Vous avez économisé</p>
          <p className="text-2xl font-bold text-green-800">{moneySaved.toFixed(2)} €</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cigarettes par jour
          </label>
          <input
            type="range"
            min="1"
            max="40"
            value={cigarettesPerDay}
            onChange={(e) => setCigarettesPerDay(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>{cigarettesPerDay}</span>
            <span>40</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix du paquet (€)
          </label>
          <input
            type="range"
            min="500"
            max="1500"
            step="10"
            value={packPrice}
            onChange={(e) => setPackPrice(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5,00 €</span>
            <span>{(packPrice / 100).toFixed(2)} €</span>
            <span>15,00 €</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-medium text-gray-700 mb-3">Projections futures</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projections.map((projection, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">{projection.label}</p>
              <p className="text-xl font-bold text-gray-900">{projection.amount.toFixed(2)} €</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}