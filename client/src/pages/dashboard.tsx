import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import StatCard from "@/components/dashboard/stat-card";
import SimpleCigaretteTracker from "@/components/dashboard/simple-cigarette-tracker";
import SavingsGraph from "@/components/dashboard/savings-graph";
import HealthBenefits from "@/components/dashboard/health-benefits";
import DailyTip from "@/components/dashboard/daily-tip";
import Achievements from "@/components/dashboard/achievements";
import { Clock, XCircle, PlusCircle, Heart } from "lucide-react";
import { getDefaultUserData } from "@/lib/get-default-user-data";

export default function Dashboard() {
  // For demo purposes, we're using a default user
  // In a real app, this would fetch the current user ID from auth context
  const userId = 1;
  
  // Fetch user stats from API
  const { data: userWithStats, isLoading, isError } = useQuery({
    queryKey: ['/api/users/' + userId + '/with-stats'],
  });
  
  // Fall back to demo data if API not available
  const defaultData = getDefaultUserData();
  const userData = userWithStats || defaultData;
  
  // Ensure we have stats data, fallback to default if necessary
  const stats = (userData as any)?.stats || defaultData.stats;
  
  const {
    daysSinceSmoking,
    cigarettesAvoided,
    moneySaved,
    healthRecoveryPercentage,
    lastCraving,
    longestStreak
  } = stats;
  
  return (
    <Layout 
      title="Tableau de bord" 
      subtitle="Voici un résumé de votre progression"
    >
      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Jours sans fumer"
          value={daysSinceSmoking}
          icon={<Clock className="h-6 w-6" />}
          trend="+3 jours depuis la semaine dernière"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        
        <StatCard
          title="Cigarettes évitées"
          value={cigarettesAvoided}
          icon={<XCircle className="h-6 w-6" />}
          trend={`Environ ${Math.round(cigarettesAvoided / daysSinceSmoking)} par jour`}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        
        <StatCard
          title="Économies réalisées"
          value={`${moneySaved} €`}
          icon={<PlusCircle className="h-6 w-6" />}
          trend={`${Math.round(moneySaved / 4)} € cette semaine`}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatCard
          title="Santé récupérée"
          value={`${healthRecoveryPercentage}%`}
          icon={<Heart className="h-6 w-6" />}
          trend="Amélioration de la respiration"
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>
      
      {/* Cigarette Tracker */}
      <SimpleCigaretteTracker userId={userId} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Graph */}
        <SavingsGraph userId={userId} />
        
        {/* Health Benefits */}
        <HealthBenefits userId={userId} daysSinceSmoking={daysSinceSmoking} />
      </div>
      
      {/* Daily Tip */}
      <DailyTip userId={userId} />
      
      {/* Achievements */}
      <Achievements userId={userId} daysSinceSmoking={daysSinceSmoking} />
    </Layout>
  );
}
