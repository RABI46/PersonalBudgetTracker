import { useState } from "react";
import { motion } from "framer-motion";
import { CRAVING_CONTEXTS, CRAVING_INTENSITIES } from "@/lib/constants";

interface CravingModalProps {
  onClose: () => void;
  onSubmit: (data: {
    intensity: string;
    context: string;
    resisted: boolean;
  }) => void;
  isPending: boolean;
}

export default function CravingModal({ onClose, onSubmit, isPending }: CravingModalProps) {
  const [intensity, setIntensity] = useState("medium");
  const [context, setContext] = useState("");
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking outside the content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleSubmit = (resisted: boolean) => {
    if (!context) {
      // Require selecting a context
      return;
    }
    
    onSubmit({
      intensity,
      context,
      resisted
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl m-4 max-w-md mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">J'ai une envie de fumer</h2>
          <p className="text-gray-600 mb-4">
            Enregistrez votre envie pour suivre votre progression et développer des stratégies pour y résister.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Intensité de l'envie</label>
            <div className="flex justify-between items-center">
              {CRAVING_INTENSITIES.map(item => (
                <button
                  key={item.id}
                  onClick={() => setIntensity(item.id)}
                  className={`w-full py-2 border ${
                    item.id === CRAVING_INTENSITIES[0].id ? 'rounded-l-lg border-r-0' : 
                    item.id === CRAVING_INTENSITIES[CRAVING_INTENSITIES.length - 1].id ? 'rounded-r-lg border-l-0' : ''
                  } ${
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
          
          <div className="flex mt-6 space-x-3">
            <button
              disabled={isPending || !context}
              onClick={() => handleSubmit(false)}
              className={`flex-1 py-3 border border-gray-300 rounded-lg font-medium ${
                isPending || !context ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              J'ai fumé
            </button>
            <button
              disabled={isPending || !context}
              onClick={() => handleSubmit(true)}
              className={`flex-1 py-3 rounded-lg font-medium ${
                isPending || !context 
                  ? 'opacity-50 cursor-not-allowed bg-blue-300' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              J'ai résisté
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
