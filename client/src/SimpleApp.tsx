import { useState } from "react";

// Composant très simple pour tester le rendu de base
function SimpleApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-10 max-w-md mx-auto bg-white rounded-xl shadow-md my-10">
      <h1 className="text-2xl font-bold text-center mb-4">Test Application</h1>
      
      <p className="text-center mb-4">
        L'application fonctionne correctement!
      </p>
      
      <div className="text-center mb-4">
        <p>Compteur: {count}</p>
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Diminuer
        </button>
        
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Augmenter
        </button>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Cette page est une version simplifiée pour tester les fonctionnalités de base.
        </p>
      </div>
    </div>
  );
}

export default SimpleApp;