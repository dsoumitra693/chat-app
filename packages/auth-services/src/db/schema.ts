import { uuid, serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core';
const { v4: uuidV4 } = require('uuid');

export const account = pgTable('account', {
  id: uuid('id').primaryKey(), // Auto-incrementing primary key
  phone: text('phone').notNull().unique(), // Phone number, must be unique
  password: text('password').notNull(), // Hashed password field, required
  createdAt: timestamp('created_at').defaultNow(), // Set the current timestamp on insert
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Set the current timestamp on updates
});
