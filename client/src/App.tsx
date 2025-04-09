import { useState } from "react";
import { Route, Switch, Link } from "wouter";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import SimpleCigaretteTracker from "@/components/dashboard/simple-cigarette-tracker";
import StatsOverview from "@/components/dashboard/stats-overview";
import SavingsCalculator from "@/components/dashboard/savings-calculator";
import HealthTimeline from "@/components/dashboard/health-timeline";

// Page d'accueil améliorée
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Section d'en-tête */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">StopClope</h1>
          <p className="text-xl max-w-2xl mb-8">
            Votre compagnon pour arrêter de fumer. Suivez votre progression, célébrez vos succès et retrouvez une vie sans tabac.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors">
              Accéder au Dashboard
            </Link>
            <Link href="/tips" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
              Conseils pour arrêter
            </Link>
          </div>
        </div>
      </header>
      
      {/* Section des fonctionnalités */}
      <section className="py-16 container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-12">Comment StopClope vous aide à arrêter de fumer</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi de progression</h3>
            <p className="text-gray-600">
              Suivez votre progression et visualisez les avantages pour votre santé et vos économies à chaque jour sans tabac.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Suivi des envies</h3>
            <p className="text-gray-600">
              Enregistrez et analysez vos envies de fumer pour mieux comprendre vos déclencheurs et les éviter.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Conseils personnalisés</h3>
            <p className="text-gray-600">
              Recevez des conseils quotidiens adaptés à votre progression pour vous aider dans les moments difficiles.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}

// Page Dashboard améliorée
function DashboardPage() {
  // Nous utilisons un ID d'utilisateur fixe pour le moment (utilisateur par défaut)
  const userId = 1;
  
  // Récupération des statistiques de l'utilisateur
  const { data: userStatsData, isLoading } = useQuery({
    queryKey: ['/api/users/' + userId + '/stats']
  });
  
  // Valeurs par défaut en cas de chargement
  const stats = userStatsData || {
    daysSinceSmoking: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    healthRecoveryPercentage: 0,
    longestStreak: 0
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            {!isLoading && stats.daysSinceSmoking > 0 && (
              <p className="text-gray-600">
                Jour {stats.daysSinceSmoking} de votre vie sans tabac
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Link href="/tips" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
              Conseils
            </Link>
            <Link href="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              Accueil
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-center py-4">Chargement des données...</p>
          </div>
        ) : (
          <>
            {/* Vue d'ensemble des statistiques */}
            <StatsOverview 
              daysSinceSmoking={stats.daysSinceSmoking}
              cigarettesAvoided={stats.cigarettesAvoided}
              moneySaved={stats.moneySaved}
              longestStreak={stats.longestStreak}
            />
            
            {/* Suivi des envies */}
            <SimpleCigaretteTracker userId={userId} />
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Économies réalisées */}
              <SavingsCalculator 
                daysSinceSmoking={stats.daysSinceSmoking} 
                initialCigarettesPerDay={Math.ceil(stats.cigarettesAvoided / stats.daysSinceSmoking)}
              />
              
              {/* Bénéfices santé */}
              <HealthTimeline daysSinceSmoking={stats.daysSinceSmoking} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Page Non trouvée
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Page non trouvée</h1>
        <p className="text-gray-600 text-center mb-6">
          La page que vous recherchez n'existe pas.
        </p>
        <Link href="/" className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

// Page de conseils simplifiée
function TipsPage() {
  // Données de test pour afficher des conseils
  const tips = [
    {
      id: 1,
      title: "Restez hydraté",
      content: "Boire beaucoup d'eau peut aider à réduire l'envie de fumer et à éliminer la nicotine de votre corps."
    },
    {
      id: 2,
      title: "Exercice régulier",
      content: "L'activité physique peut réduire les envies de fumer et améliorer votre humeur grâce à la libération d'endorphines."
    },
    {
      id: 3,
      title: "Trouvez un substitut",
      content: "Ayez toujours quelque chose pour occuper vos mains et votre bouche, comme des bâtonnets de carotte ou des chewing-gums sans sucre."
    },
    {
      id: 4,
      title: "Évitez les déclencheurs",
      content: "Identifiez les situations qui vous donnent envie de fumer et évitez-les dans les premières semaines d'arrêt."
    },
    {
      id: 5,
      title: "Cherchez du soutien",
      content: "Parlez à vos amis, votre famille ou rejoignez un groupe de soutien pour partager vos expériences et défis."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Conseils pour arrêter de fumer</h1>
          <div className="flex space-x-3">
            <Link href="/dashboard" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
              Dashboard
            </Link>
            <Link href="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              Accueil
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {tips.map(tip => (
            <div key={tip.id} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
              <p className="text-gray-600">{tip.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Routeur simplifié
function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/tips" component={TipsPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

// Composant principal de l'application
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
