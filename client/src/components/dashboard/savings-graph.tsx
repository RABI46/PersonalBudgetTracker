import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { CHART_PERIODS } from "@/lib/constants";

interface SavingsGraphProps {
  userId: number;
}

export default function SavingsGraph({ userId }: SavingsGraphProps) {
  const [activePeriod, setActivePeriod] = useState(CHART_PERIODS[0]);
  
  // Fetch user stats for the savings data
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['/api/users/' + userId + '/stats'],
  });
  
  // Generate sample data based on current savings and selected period
  const generateData = () => {
    if (!userStats) return [];
    
    const { moneySaved, daysSinceSmoking } = userStats;
    const savingsPerDay = moneySaved / daysSinceSmoking;
    
    // Generate data points
    return Array.from({ length: activePeriod.days }).map((_, index) => {
      const day = index + 1;
      // Cap the savings at the actual days since smoking
      const estimatedSavings = day <= daysSinceSmoking 
        ? savingsPerDay * day 
        : savingsPerDay * daysSinceSmoking + (day - daysSinceSmoking) * savingsPerDay;
        
      return {
        day,
        savings: Math.round(estimatedSavings),
      };
    });
  };
  
  const data = generateData();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Économies réalisées</h2>
      
      <div className="h-64">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p>Chargement...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="day" 
                tickFormatter={(value) => `J${value}`}
                stroke="#9CA3AF"
              />
              <YAxis 
                tickFormatter={(value) => `${value}€`}
                stroke="#9CA3AF"
              />
              <Tooltip 
                formatter={(value) => [`${value}€`, 'Économies']}
                labelFormatter={(value) => `Jour ${value}`}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="flex justify-between mt-4">
        {CHART_PERIODS.map((period) => (
          <button
            key={period.id}
            className={`text-sm font-medium ${
              activePeriod.id === period.id ? 'text-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActivePeriod(period)}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  );
}
