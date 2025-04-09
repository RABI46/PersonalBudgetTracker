import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertCravingSchema,
  insertAchievementSchema,
  insertHealthTipSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const userData = req.body;
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Craving routes
  app.post("/api/cravings", async (req, res) => {
    try {
      const validatedData = insertCravingSchema.parse(req.body);
      const craving = await storage.createCraving(validatedData);
      res.status(201).json(craving);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create craving record" });
      }
    }
  });

  app.get("/api/cravings/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const cravings = await storage.getCravingsByUserId(userId);
      res.json(cravings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cravings" });
    }
  });

  app.get("/api/cravings/user/:userId/last", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const lastCraving = await storage.getLastCravingByUserId(userId);
      
      if (!lastCraving) {
        return res.status(404).json({ message: "No cravings found for user" });
      }
      
      res.json(lastCraving);
    } catch (error) {
      res.status(500).json({ message: "Failed to get last craving" });
    }
  });

  // Health tip routes
  app.get("/api/health-tips", async (req, res) => {
    try {
      const tips = await storage.getAllHealthTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to get health tips" });
    }
  });

  app.get("/api/health-tips/:id", async (req, res) => {
    try {
      const tipId = parseInt(req.params.id, 10);
      const tip = await storage.getHealthTip(tipId);
      
      if (!tip) {
        return res.status(404).json({ message: "Health tip not found" });
      }
      
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Failed to get health tip" });
    }
  });

  app.post("/api/health-tips", async (req, res) => {
    try {
      const validatedData = insertHealthTipSchema.parse(req.body);
      const tip = await storage.createHealthTip(validatedData);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create health tip" });
      }
    }
  });

  // Achievement routes
  app.get("/api/achievements/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const achievements = await storage.getAchievementsByUserId(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.status(201).json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create achievement" });
      }
    }
  });

  // Statistics routes
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const stats = await storage.getUserStats(userId);
      
      if (!stats) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user statistics" });
    }
  });

  app.get("/api/users/:userId/with-stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const userWithStats = await storage.getUserWithStats(userId);
      
      if (!userWithStats) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(userWithStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user with statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
