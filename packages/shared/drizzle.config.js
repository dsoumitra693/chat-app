"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "./" });
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: 'postgresql',
    schema: './db/schema.ts',
    dbCredentials: {
        url: process.env.DRIZZLE_DATABASE_URL,
    },
    verbose: true,
    strict: true,
});
