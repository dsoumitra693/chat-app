import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  json,
} from 'drizzle-orm/pg-core';

// Define the Accounts Table
export const account = pgTable('account', {
  id: uuid('id').primaryKey().defaultRandom(), // Auto-incrementing primary key
  phone: text('phone').notNull().unique(), // Phone number, must be unique
  createdAt: timestamp('created_at').defaultNow(), // Set the current timestamp on insert
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Set the current timestamp on updates
});

// Define the Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(), // UUID as primary key
  fullname: varchar('fullname', { length: 255 }).notNull(), 
  bio: varchar('bio', { length: 255 }).default(""), // Full name, required
  phone: varchar('phone', { length: 10 }).unique().notNull(), // Unique phone
  profilePicture: varchar('profile_picture', { length: 255 }).default(''), // Optional profile picture
  accountId: uuid('account_id')
    .notNull()
    .references(() => account.id), // Foreign key to accounts
  createdAt: timestamp('created_at').defaultNow(), // Creation timestamp
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()), // Update timestamp
});

// User Contacts Table
export const userContacts = pgTable(
  'user_contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    contactId: uuid('contact_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    // Composite unique index to prevent duplicate entries for user-contact pairs
    return {
      uniqueConstraint: {
        columns: [table.userId, table.contactId],
        name: 'unique_user_contact',
      },
    };
  }
);

// Define the User Settings Table
export const userSettings = pgTable('user_settings', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id), // Foreign key to users
  notificationSettings: json('notification_settings').default(() => 
    JSON.stringify({})
  ), // Corrected to use default empty JSON object
  privacySettings: json('privacy_settings').default(() => // Fixed the column name from notification_settings to privacy_settings
    JSON.stringify({})
  ),
  createdAt: timestamp('created_at').defaultNow(), // Creation timestamp
  updatedAt: timestamp('updated_at').defaultNow().$onUpdateFn(() => new Date()), // Update timestamp
});
