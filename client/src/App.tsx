import { useState } from "react";
import { Route, Switch, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import SimpleCigaretteTracker from "@/components/dashboard/simple-cigarette-tracker";

// Page d'accueil simplifiée
function HomePage() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const handleIncrement = () => {
    try {
      setCount(prev => prev + 1);
    } catch (err) {
      setError("Erreur lors de l'incrémentation");
      console.error(err);
    }
  };
  
  const handleDecrement = () => {
    try {
      setCount(prev => prev - 1);
    } catch (err) {
      setError("Erreur lors de la décrémentation");
      console.error(err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">StopClope</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-center items-center space-x-4 mb-8">
          <button
            onClick={handleDecrement}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Diminuer
          </button>
          
          <span className="text-2xl font-bold">{count}</span>
          
          <button
            onClick={handleIncrement}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Augmenter
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link href="/dashboard" className="block w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-center">
            Accéder au Dashboard
          </Link>
        </div>
        
        <p className="text-gray-600 text-center mt-4">
          Version simplifiée pour tester les interactions de base.
        </p>
      </div>
    </div>
  );
}

// Page Dashboard améliorée
function DashboardPage() {
  // Nous utilisons un ID d'utilisateur fixe pour le moment (utilisateur par défaut)
  const userId = 1;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <Link href="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            Retour à l'accueil
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="p-6 bg-blue-50 rounded-lg mb-6">
            <p className="text-blue-600">
              Bienvenue dans votre tableau de bord. Cette version simplifiée vous permet de suivre vos envies de cigarette.
            </p>
          </div>
          
          {/* Composant SimpleCigaretteTracker */}
          <SimpleCigaretteTracker userId={userId} />
        </div>
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

// Routeur simplifié
function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={DashboardPage} />
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
