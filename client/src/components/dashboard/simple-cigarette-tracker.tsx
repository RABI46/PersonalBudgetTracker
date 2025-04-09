import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Edit } from "lucide-react";
import { ProgressBarWithLabels } from "@/components/ui/progress-bar";
import { formatDuration, getTimeSince } from "@/lib/calculate-benefits";
import { CRAVING_CONTEXTS, CRAVING_INTENSITIES } from "@/lib/constants";

// Simplified modal component
function SimpleCravingModal({ 
  onClose, 
  onSubmit, 
  isPending 
}: { 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
  isPending: boolean; 
}) {
  const [intensity, setIntensity] = useState("medium");
  const [context, setContext] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (resisted: boolean) => {
    if (!context) {
      setError("Veuillez sélectionner un contexte");
      return;
    }
    
    onSubmit({
      intensity,
      context,
      resisted
    });
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl m-4 max-w-md mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">J'ai une envie de fumer</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Intensité de l'envie</label>
            <div className="flex space-x-2">
              {CRAVING_INTENSITIES.map(item => (
                <button
                  key={item.id}
                  onClick={() => setIntensity(item.id)}
                  className={`px-3 py-1 border rounded ${
                    intensity === item.id 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contexte de l'envie</label>
            <div className="grid grid-cols-2 gap-2">
              {CRAVING_CONTEXTS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setContext(item.id)}
                  className={`py-2 px-4 border rounded text-left ${
                    context === item.id 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex mt-6 space-x-3">
            <button
              disabled={isPending || !context}
              onClick={() => handleSubmit(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
            >
              J'ai fumé
            </button>
            <button
              disabled={isPending || !context}
              onClick={() => handleSubmit(true)}
              className="flex-1 py-3 rounded-lg font-medium bg-blue-600 text-white"
            >
              J'ai résisté
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimpleCigaretteTracker({ userId }: { userId: number }) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the last craving
  const { 
    data: lastCravingData, 
    isLoading: isLoadingCraving,
    refetch: refetchCraving
  } = useQuery({
    queryKey: ['/api/cravings/user/' + userId + '/last']
  });
  
  // Fetch user stats to get longest streak
  const {
    data: userStatsData,
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['/api/users/' + userId + '/stats']
  });
  
  const lastCraving = lastCravingData;
  const longestStreak = (userStatsData as any)?.longestStreak || 0;
  
  // Calculate time since last craving
  let timeSince = "N/A";
  let currentMinutes = 0;
  let progress = 0;
  
  if (lastCraving && (lastCraving as any)?.createdAt) {
    try {
      const createdAtStr = (lastCraving as any).createdAt;
      const createdDate = new Date(createdAtStr);
      timeSince = getTimeSince(createdAtStr);
      currentMinutes = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60));
      progress = longestStreak > 0 ? Math.min((currentMinutes / longestStreak) * 100, 100) : 0;
    } catch (err) {
      console.error('Error calculating time since:', err);
    }
  }
  
  // Create a new craving
  const createCravingMutation = useMutation({
    mutationFn: async (cravingData: any) => {
      try {
        setError(null);
        const response = await apiRequest('POST', '/api/cravings', {
          ...cravingData,
          userId
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'enregistrement');
        }
        
        return response.json();
      } catch (err) {
        setError('Erreur lors de l\'enregistrement. Veuillez réessayer.');
        throw err;
      }
    },
    onSuccess: () => {
      // Close modal and refresh data
      setShowModal(false);
      refetchCraving();
      refetchStats();
    }
  });
  
  // Handle form submission
  const handleSubmitCraving = (data: any) => {
    createCravingMutation.mutate(data);
  };
  
  if (isLoadingCraving || isLoadingStats) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <p className="text-center py-4">Chargement en cours...</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Suivi des cigarettes</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
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
                {lastCraving ? `Il y a ${timeSince}` : "Aucune envie enregistrée"}
              </p>
            </div>
          </div>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            onClick={() => setShowModal(true)}
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
      
      {showModal && (
        <SimpleCravingModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitCraving}
          isPending={createCravingMutation.isPending}
        />
      )}
    </>
  );
}