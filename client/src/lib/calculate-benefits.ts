import { HEALTH_MILESTONES } from "./constants";

/**
 * Calculates health benefits based on number of days quit smoking
 */
export function calculateHealthBenefits(daysSinceSmoking: number) {
  // Sort milestones by days
  const sortedMilestones = [...HEALTH_MILESTONES].sort((a, b) => a.days - b.days);
  
  // Filter milestones into achieved and upcoming
  const achievedMilestones = sortedMilestones.filter(
    milestone => milestone.days <= daysSinceSmoking
  );
  
  const upcomingMilestones = sortedMilestones.filter(
    milestone => milestone.days > daysSinceSmoking
  );
  
  return {
    achieved: achievedMilestones,
    upcoming: upcomingMilestones
  };
}

/**
 * Calculates money saved based on cigarette consumption and price
 */
export function calculateMoneySaved(
  cigarettesPerDay: number,
  pricePerPack: number,
  cigarettesPerPack: number,
  daysSinceSmoking: number
) {
  const pricePerCigarette = pricePerPack / cigarettesPerPack;
  const totalCigarettesAvoided = cigarettesPerDay * daysSinceSmoking;
  return (totalCigarettesAvoided * pricePerCigarette) / 100; // Convert from cents to euros
}

/**
 * Formats duration in minutes to a human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Calculates time since a given date
 */
export function getTimeSince(date: string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInMs = now.getTime() - pastDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  return formatDuration(diffInMinutes);
}
