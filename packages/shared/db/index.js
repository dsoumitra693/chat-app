"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_db = init_db;
const serverless_1 = require("@neondatabase/serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
/**
 * Initializes a Neon database client and Drizzle ORM instance.
 *
 * @param db_url - The database URL used to connect to the Neon database.
 *
 * @returns {Database} - The Drizzle ORM instance configured to interact with the Neon database.
 *
 * @throws {Error} Throws an error if the provided database URL is not defined.
 */
function init_db() {
    // Ensure the DRIZZLE_DATABASE_URL environment variable is defined
    if (!process.env.DRIZZLE_DATABASE_URL) {
        // Fix the condition to check if db_url is not defined
        throw new Error('Database URL is not defined in .env');
    }
    const neonClient = (0, serverless_1.neon)(process.env.DRIZZLE_DATABASE_URL); // Initialize the Neon database client
    return (0, neon_http_1.drizzle)(neonClient); // Return the Drizzle ORM instance
}
