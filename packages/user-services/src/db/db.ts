import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

// Load environment variables from a .env file into process.env
config();

// Ensure that the database URL is defined in the environment variables
if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error('Database URL is not defined in .env');
}

// Initialize the Neon database client using the provided database URL
const neonClient = neon(process.env.DRIZZLE_DATABASE_URL!);

/**
 * Create a Drizzle ORM instance with the Neon database client.
 * This instance can be used to interact with the database.
 */
export const db = drizzle(neonClient);
