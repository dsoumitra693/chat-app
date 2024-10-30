"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSettings = exports.userContacts = exports.users = exports.account = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Defines the Accounts Table.
 *
 * This table stores account-related information including a unique phone number
 * and a hashed password. It also tracks the creation and update timestamps.
 */
exports.account = (0, pg_core_1.pgTable)('account', {
    id: (0, pg_core_1.uuid)('id').primaryKey(), // Auto-incrementing primary key
    phone: (0, pg_core_1.text)('phone').notNull().unique(), // Phone number, must be unique
    password: (0, pg_core_1.text)('password').notNull(), // Hashed password field, required
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(), // Set the current timestamp on insert
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdateFn(() => new Date()), // Set the current timestamp on updates
});
/**
 * Defines the Users Table.
 *
 * This table stores user profiles including their full name, bio, and contact information.
 * It links to the Accounts Table through a foreign key and tracks creation and update timestamps.
 */
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(), // UUID as primary key
    fullname: (0, pg_core_1.varchar)('fullname', { length: 255 }).notNull(), // User's full name
    bio: (0, pg_core_1.varchar)('bio', { length: 255 }).default(''), // User biography
    phone: (0, pg_core_1.varchar)('phone', { length: 10 }).unique().notNull(), // Unique phone number
    profilePicture: (0, pg_core_1.varchar)('profile_picture', { length: 255 }).default(''), // Optional profile picture URL
    accountId: (0, pg_core_1.uuid)('account_id')
        .notNull()
        .references(() => exports.account.id), // Foreign key to accounts
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(), // Creation timestamp
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdateFn(() => new Date()), // Update timestamp
});
/**
 * Defines the User Contacts Table.
 *
 * This table maintains relationships between users and their contacts.
 * It prevents duplicate entries for user-contact pairs through a composite unique index.
 */
exports.userContacts = (0, pg_core_1.pgTable)('user_contacts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(), // Unique identifier for user contacts
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, {
        onDelete: 'cascade', // Cascade delete on user removal
    }),
    contactUserId: (0, pg_core_1.uuid)('contact_user_id').references(() => exports.users.id, {
        onDelete: 'cascade', // Cascade delete on contact removal
    }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(), // Creation timestamp
});
/**
 * Defines the User Settings Table.
 *
 * This table stores user-specific settings related to notifications and privacy.
 * It is linked to the Users Table through a foreign key.
 */
exports.userSettings = (0, pg_core_1.pgTable)('user_settings', {
    userId: (0, pg_core_1.uuid)('user_id')
        .primaryKey()
        .references(() => exports.users.id), // Foreign key to users
    notificationSettings: (0, pg_core_1.json)('notification_settings').default(() => JSON.stringify({}) // Default to an empty JSON object for notifications
    ),
    privacySettings: (0, pg_core_1.json)('privacy_settings').default(() => JSON.stringify({}) // Default to an empty JSON object for privacy settings
    ),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(), // Creation timestamp
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdateFn(() => new Date()), // Update timestamp
});
