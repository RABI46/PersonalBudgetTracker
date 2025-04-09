import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Edit } from "lucide-react";
import { ProgressBarWithLabels } from "@/components/ui/progress-bar";
import { formatDuration, getTimeSince } from "@/lib/calculate-benefits";
import CravingModal from "@/components/craving-modal";
import { type Craving } from "@shared/schema";

interface CigaretteTrackerProps {
  userId: number;
  lastCraving?: Craving | null;
  longestStreak: number;
}

export default function CigaretteTracker({ 
  userId, 
  lastCraving,
  longestStreak
}: CigaretteTrackerProps) {
  const [showCravingModal, setShowCravingModal] = useState(false);
  
  // Get last craving data from API if not provided
  const { data: fetchedLastCraving } = useQuery({
    queryKey: ['/api/cravings/user/' + userId + '/last'],
    enabled: !lastCraving
  });

  const craving = lastCraving || fetchedLastCraving;
  
  // Calculate time since last craving
  const timeSinceLastCraving = craving ? getTimeSince(craving.createdAt) : "N/A";
  
  // Calculate progress percentage - max is longest streak
  const currentMinutes = craving 
    ? Math.floor((Date.now() - new Date(craving.createdAt).getTime()) / (1000 * 60))
    : 0;
  
  const progress = longestStreak > 0 
    ? Math.min((currentMinutes / longestStreak) * 100, 100) 
    : 0;
  
  const handleCravingModalOpen = () => {
    setShowCravingModal(true);
  };
  
  const handleCravingModalClose = () => {
    setShowCravingModal(false);
  };
  
  // Mutation to log a craving
  const logCravingMutation = useMutation({
    mutationFn: async (cravingData: any) => {
      const response = await apiRequest('POST', '/api/cravings', {
        ...cravingData,
        userId
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cravings/user/' + userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/cravings/user/' + userId + '/last'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/' + userId + '/stats'] });
      setShowCravingModal(false);
    }
  });
  
  const handleLogCraving = (data: any) => {
    logCravingMutation.mutate(data);
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Suivi des cigarettes</h2>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Dernière envie de fumer</p>
              <p className="text-lg font-semibold text-gray-800">
                {craving ? `Il y a ${timeSinceLastCraving}` : "Aucune envie enregistrée"}
              </p>
            </div>
          </div>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            onClick={handleCravingModalOpen}
          >
            J'ai une envie de fumer
          </button>
        </div>
        
        <ProgressBarWithLabels
          progress={progress}
          leftLabel="Envie précédente"
          centerLabel={`Progression : ${Math.round(progress)}%`}
          rightLabel={`Record : ${formatDuration(longestStreak)}`}
        />
      </div>
      
      {showCravingModal && (
        <CravingModal 
          onClose={handleCravingModalClose} 
          onSubmit={handleLogCraving}
          isPending={logCravingMutation.isPending}
        />
      )}
    </>
  );
}
