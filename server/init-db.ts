import { db } from './db';
import { users, cravings } from '../shared/schema';
import { storage, DatabaseStorage } from './storage';
import { log } from './vite';

/**
 * Initializes the database with a default user for testing purposes.
 * This is to simplify testing of the application without needing to register first.
 */
export async function initializeDatabase() {
  log('Checking if we need to initialize database with default data...', 'db-init');
  
  if (storage instanceof DatabaseStorage) {
    try {
      // Check if default user exists
      const user = await storage.getUserByUsername('demo_user');
      
      if (!user) {
        log('Creating default user...', 'db-init');
        
        // Create a default user
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 15); // 15 days ago
        
        const newUser = await storage.createUser({
          username: 'demo_user',
          password: 'password123', // This is just for demo
          cigarettesPerDay: 20,
          cigarettePackPrice: 1050, // 10.50€ in cents
          cigarettesPerPack: 20,
          quitDate: oneMonthAgo,
        });
        
        log(`Default user created with ID: ${newUser.id}`, 'db-init');
        
        // Create a default craving record
        await storage.createCraving({
          userId: newUser.id,
          intensity: 'medium',
          context: 'coffee',
          resisted: true,
        });
        
        log('Default craving record created.', 'db-init');
      } else {
        log('Default user already exists, skipping initialization.', 'db-init');
      }
      
      // Initialize health tips (this is already handled in routes.ts)
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}