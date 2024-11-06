import { uuid, text, timestamp, pgTable } from 'drizzle-orm/pg-core';
const { v4: uuidV4 } = require('uuid');

/**
 * Defines the structure of the 'account' table in the database using Drizzle ORM.
 * 
 * @constant {pgTable} account - The table definition for the 'account' table.
 * 
 * @property {uuid} id - The unique identifier for each account, serving as the primary key.
 * @property {text} phone - The phone number associated with the account, which must be unique and cannot be null.
 * @property {text} password - The hashed password for the account, which cannot be null.
 * @property {timestamp} createdAt - The timestamp indicating when the account was created, 
 *                                   automatically set to the current time upon insertion.
 * @property {timestamp} updatedAt - The timestamp indicating the last time the account was updated, 
 *                                   automatically set to the current time upon insertion and updated on subsequent updates.
 */
export const account = pgTable('account', {
  id: uuid('id').primaryKey(), // Auto-incrementing primary key
  phone: text('phone').notNull().unique(), // Phone number, must be unique
  password: text('password').notNull(), // Hashed password field, required
  createdAt: timestamp('created_at').defaultNow(), // Set the current timestamp on insert
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Set the current timestamp on updates
});
