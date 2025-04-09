import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_CIGARETTE_PACK_PRICE, DEFAULT_CIGARETTES_PER_PACK } from "@/lib/constants";
import { Save, RefreshCw, AlertTriangle } from "lucide-react";

interface UserProfileFormProps {
  userId: number;
}

export default function UserProfileForm({ userId }: UserProfileFormProps) {
  const { toast } = useToast();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  // Récupération des données utilisateur
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users/' + userId]
  });
  
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    username: "",
    cigarettesPerDay: 10,
    packPrice: DEFAULT_CIGARETTE_PACK_PRICE,
    quitDate: "",
  });
  
  // Mettre à jour le formulaire lorsque les données utilisateur sont chargées
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        cigarettesPerDay: user.cigarettesPerDay || 10,
        packPrice: user.packPrice || DEFAULT_CIGARETTE_PACK_PRICE,
        quitDate: user.quitDate ? new Date(user.quitDate).toISOString().split('T')[0] : "",
      });
    }
  }, [user]);
  
  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', `/api/users/${userId}`, data);
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
      console.error(error);
    }
  });
  
  // Mutation pour réinitialiser les compteurs
  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString();
      const response = await apiRequest('PATCH', `/api/users/${userId}`, {
        quitDate: today
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la réinitialisation des compteurs');
      }
      
      // Supprimer toutes les envies enregistrées
      const deleteResponse = await apiRequest('DELETE', `/api/cravings/user/${userId}`);
      if (!deleteResponse.ok) {
        throw new Error('Erreur lors de la suppression des envies');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
      queryClient.invalidateQueries({ queryKey: [`/api/cravings/user/${userId}/last`] });
      
      toast({
        title: "Compteurs réinitialisés",
        description: "Tous vos compteurs ont été remis à zéro. Votre nouvelle date d'arrêt est aujourd'hui.",
      });
      
      setIsResetModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation des compteurs.",
        variant: "destructive",
      });
      console.error(error);
      setIsResetModalOpen(false);
    }
  });
  
  // Gestion du changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };
  
  // Modal de confirmation de réinitialisation
  const ResetConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-start mb-4">
          <div className="mr-3 bg-amber-100 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Réinitialiser les compteurs</h3>
            <p className="text-gray-600 mt-1">
              Cette action va effacer toutes vos statistiques et remettre à zéro votre compteur de jours sans fumer. La date d'arrêt sera mise à aujourd'hui.
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4">
          <p className="text-amber-700 text-sm">
            Attention : Cette action est irréversible et supprimera toutes vos données de progression.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => resetProgressMutation.mutate()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            disabled={resetProgressMutation.isPending}
          >
            {resetProgressMutation.isPending ? "En cours..." : "Réinitialiser"}
          </button>
        </div>
      </div>
    </div>
  );
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center py-4">Chargement du profil...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Mon profil</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cigarettes par jour (avant l'arrêt)
          </label>
          <input
            type="number"
            name="cigarettesPerDay"
            min="1"
            max="100"
            value={formData.cigarettesPerDay}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Ce nombre est utilisé pour calculer les économies et les cigarettes évitées.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix d'un paquet (en centimes)
          </label>
          <input
            type="number"
            name="packPrice"
            min="100"
            max="2000"
            step="10"
            value={formData.packPrice}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Par exemple, pour un paquet à 10,50€, entrez 1050.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'arrêt
          </label>
          <input
            type="date"
            name="quitDate"
            value={formData.quitDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser les compteurs
          </button>
          
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProfileMutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
      
      {isResetModalOpen && <ResetConfirmationModal />}
    </div>
  );
}