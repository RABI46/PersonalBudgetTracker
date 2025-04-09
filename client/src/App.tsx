import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Component simplifié pour validation
function SimpleCounter() {
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
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Essayer d'accéder au Dashboard
          </button>
        </div>
        
        <p className="text-gray-600 text-center mt-4">
          Version simplifiée pour tester les interactions de base.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleCounter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
