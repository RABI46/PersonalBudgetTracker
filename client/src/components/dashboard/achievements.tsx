import { Headphones, Calendar, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ACHIEVEMENT_TYPES } from "@/lib/constants";

interface AchievementProps {
  icon: React.ReactNode;
  text: string;
  unlocked: boolean;
}

function Achievement({ icon, text, unlocked }: AchievementProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full ${unlocked ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center mb-2`}>
        <div className={unlocked ? 'text-blue-600' : 'text-gray-400'}>
          {icon}
        </div>
      </div>
      <p className={`text-sm font-medium text-center ${!unlocked && 'text-gray-400'}`}>{text}</p>
    </div>
  );
}

interface AchievementsProps {
  userId: number;
  daysSinceSmoking: number;
}

export default function Achievements({ userId, daysSinceSmoking }: AchievementsProps) {
  // Fetch user achievements from API
  const { data: userAchievements } = useQuery({
    queryKey: ['/api/achievements/user/' + userId],
  });
  
  // Create achievement items with unlock status
  const achievements = ACHIEVEMENT_TYPES.map(type => {
    // Check if achievement is unlocked based on user data
    let unlocked = false;
    
    if (userAchievements) {
      // Check if the achievement exists in the user's achievements
      unlocked = userAchievements.some(
        (achievement: any) => achievement.achievementType === type.id
      );
    } else {
      // Fallback calculation based on days since smoking
      switch (type.id) {
        case 'firstDay':
          unlocked = daysSinceSmoking >= 1;
          break;
        case 'firstWeek':
          unlocked = daysSinceSmoking >= 7;
          break;
        case 'firstMonth':
          unlocked = daysSinceSmoking >= 30;
          break;
        case 'hundredDays':
          unlocked = daysSinceSmoking >= 100;
          break;
      }
    }
    
    return { ...type, unlocked };
  });
  
  // Render achievement icon
  const renderIcon = (iconName: string, size: number = 8) => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className={`h-${size} w-${size}`} />;
      case 'Calendar':
        return <Calendar className={`h-${size} w-${size}`} />;
      case 'Award':
        return <Award className={`h-${size} w-${size}`} />;
      default:
        return <Award className={`h-${size} w-${size}`} />;
    }
  };
  
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Vos réussites</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Achievement
            key={achievement.id}
            icon={renderIcon(achievement.icon)}
            text={achievement.label}
            unlocked={achievement.unlocked}
          />
        ))}
      </div>
    </div>
  );
}
