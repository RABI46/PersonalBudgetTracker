import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  cigarettesPerDay: integer("cigarettes_per_day").notNull(),
  cigarettePackPrice: integer("cigarette_pack_price").notNull(),
  cigarettesPerPack: integer("cigarettes_per_pack").notNull(),
  quitDate: timestamp("quit_date").notNull(),
  // Notification preferences
  notifyDailyProgress: boolean("notify_daily_progress").default(true).notNull(),
  notifyMilestones: boolean("notify_milestones").default(true).notNull(),
  notifyCravingReminders: boolean("notify_craving_reminders").default(true).notNull(), 
  notifyTips: boolean("notify_tips").default(true).notNull(),
  preferredNotificationTime: text("preferred_notification_time").default("08:00").notNull(),
  emailNotifications: boolean("email_notifications").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cravings = pgTable("cravings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  intensity: text("intensity").notNull(), // 'low', 'medium', 'high'
  context: text("context").notNull(), // 'stress', 'afterMeal', 'coffee', etc.
  resisted: boolean("resisted").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const healthTips = pgTable("health_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementType: text("achievement_type").notNull(), // 'firstDay', 'firstWeek', etc.
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cravings: many(cravings),
  achievements: many(achievements),
}));

export const cravingsRelations = relations(cravings, ({ one }) => ({
  user: one(users, {
    fields: [cravings.userId],
    references: [users.id]
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id]
  }),
}));

// Schema for user insertion and validation
export const insertUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    createdAt: true,
  });

// Schema for craving insertion and validation
export const insertCravingSchema = createInsertSchema(cravings)
  .omit({
    id: true,
    createdAt: true,
  });

// Schema for health tip insertion and validation
export const insertHealthTipSchema = createInsertSchema(healthTips)
  .omit({
    id: true,
    createdAt: true,
  });

// Schema for achievement insertion and validation
export const insertAchievementSchema = createInsertSchema(achievements)
  .omit({
    id: true,
    unlockedAt: true,
  });

// Types for the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCraving = z.infer<typeof insertCravingSchema>;
export type Craving = typeof cravings.$inferSelect;
export type InsertHealthTip = z.infer<typeof insertHealthTipSchema>;
export type HealthTip = typeof healthTips.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// Types for API responses
export type UserStats = {
  daysSinceSmoking: number;
  cigarettesAvoided: number;
  moneySaved: number;
  healthRecoveryPercentage: number;
  lastCraving: Craving | null;
  longestStreak: number; // in minutes
};

export type UserWithStats = User & {
  stats: UserStats;
};
