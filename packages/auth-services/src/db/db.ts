import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

// Load environment variables from the .env file
config();

// Ensure the DRIZZLE_DATABASE_URL environment variable is defined
if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error('Database URL is not defined in .env');
}

/**
 * Initializes a Neon database client and Drizzle ORM instance.
 * 
 * @const {NeonClient} neonClient - The Neon database client initialized with the provided database URL.
 * @const {Database} db - The Drizzle ORM instance configured to interact with the Neon database.
 * 
 * @throws {Error} Throws an error if the DRIZZLE_DATABASE_URL is not defined.
 */
const neonClient = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(neonClient);
