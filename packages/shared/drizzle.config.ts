import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({path:"./"});

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});