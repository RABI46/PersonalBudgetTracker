import { formatDuration } from "@/lib/calculate-benefits";
import { Clock, Cigarette, DollarSign, Heart } from "lucide-react";

interface StatsOverviewProps {
  daysSinceSmoking: number;
  cigarettesAvoided: number;
  moneySaved: number;
  longestStreak: number;
}

export default function StatsOverview({
  daysSinceSmoking,
  cigarettesAvoided,
  moneySaved,
  longestStreak
}: StatsOverviewProps) {
  const stats = [
    {
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      title: "Jours sans fumer",
      value: daysSinceSmoking.toString(),
      bgColor: "bg-blue-100"
    },
    {
      icon: <Cigarette className="h-5 w-5 text-green-600" />,
      title: "Cigarettes évitées",
      value: cigarettesAvoided.toString(),
      bgColor: "bg-green-100"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-amber-600" />,
      title: "Argent économisé",
      value: `${moneySaved.toFixed(2)} €`,
      bgColor: "bg-amber-100"
    },
    {
      icon: <Heart className="h-5 w-5 text-red-600" />,
      title: "Plus longue période",
      value: formatDuration(longestStreak),
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full mr-3 ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <span className="text-sm font-medium text-gray-600">{stat.title}</span>
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}