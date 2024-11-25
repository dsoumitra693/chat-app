import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config();

/**
 * Initializes a Neon database client and Drizzle ORM instance.
 *
 * @param db_url - The database URL used to connect to the Neon database.
 *
 * @returns {Database} - The Drizzle ORM instance configured to interact with the Neon database.
 *
 * @throws {Error} Throws an error if the provided database URL is not defined.
 */
export function init_db() {
  // Ensure the DRIZZLE_DATABASE_URL environment variable is defined
  if (!process.env.DRIZZLE_DATABASE_URL) {
    // Fix the condition to check if db_url is not defined
    throw new Error('Database URL is not defined in .env');
  }
  const neonClient = neon(process.env.DRIZZLE_DATABASE_URL!); // Initialize the Neon database client
  return drizzle(neonClient); // Return the Drizzle ORM instance
}

export const db = init_db();
export type DB = typeof db;