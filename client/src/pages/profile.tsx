import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, CreditCard, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDefaultUserData } from "@/lib/get-default-user-data";
import { DEFAULT_CIGARETTE_PACK_PRICE, DEFAULT_CIGARETTES_PER_PACK } from "@/lib/constants";

export default function Profile() {
  const { toast } = useToast();
  // For demo purposes, we're using a default user ID
  const userId = 1;
  
  // Fetch user data from API
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/users/' + userId],
  });
  
  // Fall back to demo data if API not available
  const user = userData || getDefaultUserData();
  
  // Form state
  const [formData, setFormData] = useState({
    username: user.username || "",
    cigarettesPerDay: user.cigarettesPerDay || 20,
    cigarettePackPrice: (user.cigarettePackPrice || DEFAULT_CIGARETTE_PACK_PRICE) / 100, // Convert cents to euros
    cigarettesPerPack: user.cigarettesPerPack || DEFAULT_CIGARETTES_PER_PACK,
    quitDate: user.quitDate 
      ? new Date(user.quitDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('PUT', `/api/users/${userId}`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/' + userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/' + userId + '/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/' + userId + '/with-stats'] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert numeric fields
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert price from euros to cents for storage
    const userData = {
      ...formData,
      cigarettePackPrice: Math.round(formData.cigarettePackPrice * 100)
    };
    
    updateUserMutation.mutate(userData);
  };
  
  return (
    <Layout 
      title="Profil" 
      subtitle="Gérez vos informations personnelles et vos préférences"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Votre nom d'utilisateur"
                />
              </div>
              
              <div>
                <Label htmlFor="quitDate">Date d'arrêt du tabac</Label>
                <Input
                  id="quitDate"
                  name="quitDate"
                  type="date"
                  value={formData.quitDate}
                  onChange={handleChange}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Paramètres de consommation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cigarettesPerDay">Cigarettes par jour (avant arrêt)</Label>
                <Input
                  id="cigarettesPerDay"
                  name="cigarettesPerDay"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.cigarettesPerDay}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="cigarettePackPrice">Prix d'un paquet (€)</Label>
                <Input
                  id="cigarettePackPrice"
                  name="cigarettePackPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cigarettePackPrice}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="cigarettesPerPack">Cigarettes par paquet</Label>
                <Input
                  id="cigarettesPerPack"
                  name="cigarettesPerPack"
                  type="number"
                  min="1"
                  value={formData.cigarettesPerPack}
                  onChange={handleChange}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional settings could go here */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Objectifs de sevrage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Définissez des objectifs à court et long terme pour vous aider à rester motivé dans votre parcours sans tabac.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-1">Court terme</h3>
              <p className="text-sm text-gray-600">1 mois sans fumer</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(user.stats.daysSinceSmoking / 30 * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{user.stats.daysSinceSmoking} jours / 30 jours</p>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-1">Moyen terme</h3>
              <p className="text-sm text-gray-600">6 mois sans fumer</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(user.stats.daysSinceSmoking / 180 * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{user.stats.daysSinceSmoking} jours / 180 jours</p>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-1">Long terme</h3>
              <p className="text-sm text-gray-600">1 an sans fumer</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(user.stats.daysSinceSmoking / 365 * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{user.stats.daysSinceSmoking} jours / 365 jours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
