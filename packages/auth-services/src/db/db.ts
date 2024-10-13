import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config();

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error('Database URL is not defined in .env');
}

const neonClient = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(neonClient);
