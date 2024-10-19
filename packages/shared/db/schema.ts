import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    text,
    json,
  } from 'drizzle-orm/pg-core';
  
  /**
   * Defines the Accounts Table.
   * 
   * This table stores account-related information including a unique phone number
   * and a hashed password. It also tracks the creation and update timestamps.
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
  
  /**
   * Defines the Users Table.
   * 
   * This table stores user profiles including their full name, bio, and contact information.
   * It links to the Accounts Table through a foreign key and tracks creation and update timestamps.
   */
  export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(), // UUID as primary key
    fullname: varchar('fullname', { length: 255 }).notNull(), // User's full name
    bio: varchar('bio', { length: 255 }).default(''), // User biography
    phone: varchar('phone', { length: 10 }).unique().notNull(), // Unique phone number
    profilePicture: varchar('profile_picture', { length: 255 }).default(''), // Optional profile picture URL
    accountId: uuid('account_id')
      .notNull()
      .references(() => account.id), // Foreign key to accounts
    createdAt: timestamp('created_at').defaultNow(), // Creation timestamp
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => new Date()), // Update timestamp
  });
  
  /**
   * Defines the User Contacts Table.
   * 
   * This table maintains relationships between users and their contacts.
   * It prevents duplicate entries for user-contact pairs through a composite unique index.
   */
  export const userContacts = pgTable(
    'user_contacts',
    {
      id: uuid('id').primaryKey().defaultRandom(), // Unique identifier for user contacts
      userId: uuid('user_id').references(() => users.id, {
        onDelete: 'cascade', // Cascade delete on user removal
      }),
      contactId: uuid('contact_id').references(() => users.id, {
        onDelete: 'cascade', // Cascade delete on contact removal
      }),
      createdAt: timestamp('created_at').defaultNow(), // Creation timestamp
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
  
  /**
   * Defines the User Settings Table.
   * 
   * This table stores user-specific settings related to notifications and privacy.
   * It is linked to the Users Table through a foreign key.
   */
  export const userSettings = pgTable('user_settings', {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id), // Foreign key to users
    notificationSettings: json('notification_settings').default(() =>
      JSON.stringify({}) // Default to an empty JSON object for notifications
    ),
    privacySettings: json('privacy_settings').default(() =>
      JSON.stringify({}) // Default to an empty JSON object for privacy settings
    ),
    createdAt: timestamp('created_at').defaultNow(), // Creation timestamp
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => new Date()), // Update timestamp
  });
  