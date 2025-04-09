import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema";

// Create postgres client
const client = postgres(process.env.DATABASE_URL!);

// Create Drizzle client with the schema
export const db = drizzle(client, { schema });