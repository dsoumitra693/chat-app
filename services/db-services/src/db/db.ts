import { init_db } from 'shared';

/**
 * Initializes a Neon database client and Drizzle ORM instance.
 *
 * @const {NeonClient} neonClient - The Neon database client initialized with the provided database URL.
 * @const {Database} db - The Drizzle ORM instance configured to interact with the Neon database.
 *
 * @throws {Error} Throws an error if the DRIZZLE_DATABASE_URL is not defined.
 */

export const db = init_db();
export type DB = typeof db;
