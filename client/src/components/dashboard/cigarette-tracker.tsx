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
  longestStreak = 0
}: CigaretteTrackerProps) {
  const [showCravingModal, setShowCravingModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get last craving data from API if not provided
  const { data: fetchedLastCraving, error: fetchError } = useQuery({
    queryKey: ['/api/cravings/user/' + userId + '/last'],
    enabled: !lastCraving
  });

  const craving = lastCraving || fetchedLastCraving;
  
  // Calculate time since last craving, safely handling null or undefined
  const timeSinceLastCraving = craving && (craving as any)?.createdAt 
    ? getTimeSince(typeof (craving as any).createdAt === 'string' 
        ? (craving as any).createdAt 
        : new Date((craving as any).createdAt).toISOString()) 
    : "N/A";
  
  // Calculate progress percentage - max is longest streak, with proper error handling
  let currentMinutes = 0;
  try {
    if (craving && (craving as any)?.createdAt) {
      const createdDate = typeof (craving as any).createdAt === 'string' 
        ? new Date((craving as any).createdAt) 
        : new Date((craving as any).createdAt);
      
      currentMinutes = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60));
    }
  } catch (err) {
    console.error('Error calculating current minutes:', err);
    currentMinutes = 0;
  }
  
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
      try {
        // Reset any previous error
        setError(null);
        
        const response = await apiRequest('POST', '/api/cravings', {
          ...cravingData,
          userId
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || 'Erreur lors de l\'enregistrement de l\'envie');
        }
        
        return response.json();
      } catch (error) {
        console.error('Error logging craving:', error);
        setError(typeof error === 'string' ? error : 
                (error instanceof Error ? error.message : 'Erreur inconnue'));
        throw error;
      }
    },
    onSuccess: () => {
      // Reset any error
      setError(null);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/cravings/user/' + userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/cravings/user/' + userId + '/last'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/' + userId + '/stats'] });
      
      // Close modal
      setShowCravingModal(false);
    },
    onError: (error: any) => {
      console.error('Error in mutation:', error);
      // Keep modal open to allow retrying
      // Error is already set in mutationFn
    }
  });
  
  const handleLogCraving = (data: any) => {
    try {
      logCravingMutation.mutate(data);
    } catch (err) {
      console.error('Error in handleLogCraving:', err);
      setError('Erreur lors de l\'enregistrement de l\'envie. Veuillez réessayer.');
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Suivi des cigarettes</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {fetchError && !error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
            Impossible de récupérer les dernières données. Rafraîchissez la page.
          </div>
        )}
        
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
