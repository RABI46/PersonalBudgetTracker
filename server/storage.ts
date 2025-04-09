import {
  users, type User, type InsertUser,
  cravings, type Craving, type InsertCraving,
  healthTips, type HealthTip, type InsertHealthTip,
  achievements, type Achievement, type InsertAchievement,
  type UserStats, type UserWithStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Craving methods
  getCravingsByUserId(userId: number): Promise<Craving[]>;
  createCraving(craving: InsertCraving): Promise<Craving>;
  getLastCravingByUserId(userId: number): Promise<Craving | undefined>;
  
  // Health tip methods
  getAllHealthTips(): Promise<HealthTip[]>;
  getHealthTip(id: number): Promise<HealthTip | undefined>;
  createHealthTip(tip: InsertHealthTip): Promise<HealthTip>;
  
  // Achievement methods
  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Statistics methods
  getUserStats(userId: number): Promise<UserStats | undefined>;
  getUserWithStats(userId: number): Promise<UserWithStats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cravings: Map<number, Craving>;
  private healthTips: Map<number, HealthTip>;
  private achievements: Map<number, Achievement>;
  private userIdCounter: number;
  private cravingIdCounter: number;
  private healthTipIdCounter: number;
  private achievementIdCounter: number;

  constructor() {
    this.users = new Map();
    this.cravings = new Map();
    this.healthTips = new Map();
    this.achievements = new Map();
    this.userIdCounter = 1;
    this.cravingIdCounter = 1;
    this.healthTipIdCounter = 1;
    this.achievementIdCounter = 1;
    
    // Add some default health tips
    this.initializeHealthTips();
  }

  private initializeHealthTips() {
    const tips = [
      {
        title: "Respiration 4-7-8",
        content: "Lorsque vous avez une envie de fumer, essayez la technique de respiration 4-7-8 : inspirez pendant 4 secondes, retenez pendant 7 secondes, expirez pendant 8 secondes. Répétez 3 fois."
      },
      {
        title: "Buvez beaucoup d'eau",
        content: "Rester bien hydraté peut aider à réduire les envies et à éliminer plus rapidement la nicotine de votre corps."
      },
      {
        title: "Activité physique",
        content: "Même une courte promenade de 5 minutes peut réduire significativement l'intensité d'une envie de fumer."
      },
      {
        title: "Évitez les déclencheurs",
        content: "Identifiez les situations qui vous donnent envie de fumer et essayez de les éviter pendant les premières semaines."
      },
      {
        title: "Occupez vos mains",
        content: "Gardez vos mains occupées avec un stylo, une balle anti-stress ou tout autre petit objet pour distraire votre esprit."
      }
    ];
    
    tips.forEach(tip => {
      this.createHealthTip({
        title: tip.title,
        content: tip.content
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Craving methods
  async getCravingsByUserId(userId: number): Promise<Craving[]> {
    return Array.from(this.cravings.values())
      .filter(craving => craving.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCraving(insertCraving: InsertCraving): Promise<Craving> {
    const id = this.cravingIdCounter++;
    const now = new Date();
    const craving: Craving = { 
      ...insertCraving, 
      id, 
      createdAt: now 
    };
    this.cravings.set(id, craving);
    return craving;
  }

  async getLastCravingByUserId(userId: number): Promise<Craving | undefined> {
    const userCravings = await this.getCravingsByUserId(userId);
    return userCravings.length > 0 ? userCravings[0] : undefined;
  }

  // Health tip methods
  async getAllHealthTips(): Promise<HealthTip[]> {
    return Array.from(this.healthTips.values());
  }

  async getHealthTip(id: number): Promise<HealthTip | undefined> {
    return this.healthTips.get(id);
  }

  async createHealthTip(insertTip: InsertHealthTip): Promise<HealthTip> {
    const id = this.healthTipIdCounter++;
    const now = new Date();
    const healthTip: HealthTip = { 
      ...insertTip, 
      id, 
      createdAt: now 
    };
    this.healthTips.set(id, healthTip);
    return healthTip;
  }

  // Achievement methods
  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const now = new Date();
    const achievement: Achievement = { 
      ...insertAchievement, 
      id, 
      unlockedAt: now 
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Statistics methods
  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const now = new Date();
    const quitDate = new Date(user.quitDate);
    const diffTime = Math.abs(now.getTime() - quitDate.getTime());
    const daysSinceSmoking = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const cigarettesPerDay = user.cigarettesPerDay;
    const cigarettesAvoided = cigarettesPerDay * daysSinceSmoking;
    
    const cigarettePrice = (user.cigarettePackPrice / user.cigarettesPerPack);
    const moneySaved = Math.round(cigarettesAvoided * cigarettePrice);
    
    // Health recovery is a simplified calculation
    // Max health recovery is achieved after 15 years (5475 days)
    const healthRecoveryPercentage = Math.min(Math.round((daysSinceSmoking / 5475) * 100), 100);
    
    const lastCraving = await this.getLastCravingByUserId(userId);
    
    // Calculate longest streak (in minutes) where user resisted cravings
    const userCravings = await this.getCravingsByUserId(userId);
    let longestStreak = 0;
    
    if (userCravings.length > 0) {
      // Sort by creation date
      const sortedCravings = userCravings.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      // Find longest streak between resisted cravings
      let currentStreak = 0;
      for (let i = 1; i < sortedCravings.length; i++) {
        if (sortedCravings[i-1].resisted && sortedCravings[i].resisted) {
          const diff = new Date(sortedCravings[i].createdAt).getTime() - 
                        new Date(sortedCravings[i-1].createdAt).getTime();
          const diffMinutes = Math.floor(diff / (1000 * 60));
          
          currentStreak = diffMinutes;
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
        } else {
          currentStreak = 0;
        }
      }
    }
    
    return {
      daysSinceSmoking,
      cigarettesAvoided,
      moneySaved,
      healthRecoveryPercentage,
      lastCraving: lastCraving || null,
      longestStreak
    };
  }

  async getUserWithStats(userId: number): Promise<UserWithStats | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const stats = await this.getUserStats(userId);
    if (!stats) return undefined;
    
    return {
      ...user,
      stats
    };
  }
}

export const storage = new MemStorage();
