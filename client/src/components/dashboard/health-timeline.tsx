import { calculateHealthBenefits } from "@/lib/calculate-benefits";
import { HEALTH_MILESTONES } from "@/lib/constants";
import { CheckCircle, Clock } from "lucide-react";

interface HealthTimelineProps {
  daysSinceSmoking: number;
}

export default function HealthTimeline({ daysSinceSmoking }: HealthTimelineProps) {
  const { achieved, upcoming } = calculateHealthBenefits(daysSinceSmoking);
  
  // Calculer le pourcentage de progrès jusqu'au prochain jalon
  let nextMilestoneProgress = 0;
  let daysToNextMilestone = 0;
  
  if (upcoming.length > 0) {
    const nextMilestone = upcoming[0];
    const prevMilestoneDay = achieved.length > 0 ? achieved[achieved.length - 1].days : 0;
    const totalDaysToNextMilestone = nextMilestone.days - prevMilestoneDay;
    daysToNextMilestone = nextMilestone.days - daysSinceSmoking;
    const daysProgressed = totalDaysToNextMilestone - daysToNextMilestone;
    nextMilestoneProgress = Math.round((daysProgressed / totalDaysToNextMilestone) * 100);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Votre santé s'améliore</h2>
      
      {daysSinceSmoking > 0 ? (
        <>
          <div className="flex items-center text-green-600 mb-4">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Sans cigarette depuis <strong>{daysSinceSmoking} jour{daysSinceSmoking > 1 ? 's' : ''}</strong></span>
          </div>
          
          <div className="space-y-6">
            {/* Bénéfices déjà atteints */}
            {achieved.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Bénéfices déjà obtenus</h3>
                <div className="space-y-4">
                  {achieved.map((milestone, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                        <span className="text-xs text-gray-500">Jour {milestone.days}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Prochain bénéfice */}
            {upcoming.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Prochains bénéfices à venir</h3>
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{upcoming[0].title}</h4>
                    <p className="text-sm text-gray-600">{upcoming[0].description}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Jour {daysSinceSmoking}</span>
                        <span>Jour {upcoming[0].days}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${nextMilestoneProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Encore {daysToNextMilestone} jour{daysToNextMilestone > 1 ? 's' : ''} pour atteindre ce bénéfice
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Afficher quelques bénéfices futurs supplémentaires */}
                {upcoming.length > 1 && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-gray-700 mb-3">À plus long terme</h3>
                    <div className="space-y-4">
                      {upcoming.slice(1, 3).map((milestone, index) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Clock className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                            <span className="text-xs text-gray-500">Jour {milestone.days}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {achieved.length === 0 && upcoming.length === 0 && (
              <p className="text-gray-600">
                Commencez votre parcours sans tabac pour voir les bénéfices pour votre santé.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="p-6 bg-blue-50 rounded-lg">
          <p className="text-blue-600">
            Commencez votre parcours sans tabac aujourd'hui pour voir les bénéfices pour votre santé.
          </p>
        </div>
      )}
    </div>
  );
}