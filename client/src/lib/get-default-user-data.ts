import { User } from "@shared/schema";

/**
 * Returns default user data for demo purposes.
 * This should be replaced with actual user data from API in production.
 */
export function getDefaultUserData(): Partial<User> & { stats: any } {
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 15); // 15 days ago
  
  return {
    id: 1,
    username: "demo_user",
    cigarettesPerDay: 20,
    cigarettePackPrice: 1050, // 10.50€ in cents
    cigarettesPerPack: 20,
    quitDate: oneMonthAgo.toISOString(),
    stats: {
      daysSinceSmoking: 15,
      cigarettesAvoided: 278,
      moneySaved: 187,
      healthRecoveryPercentage: 35,
      lastCraving: {
        id: 1,
        userId: 1,
        intensity: "medium",
        context: "coffee",
        resisted: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
      },
      longestStreak: 310 // 5h 10m in minutes
    }
  };
}
