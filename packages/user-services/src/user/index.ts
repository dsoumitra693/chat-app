import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db/db';
import { account, userContacts, users } from '../db/schema';

// Validation schema using Zod
const createUserSchema = z.object({
  accountId: z.string().uuid(),
  fullname: z
    .string()
    .min(3, 'Fullname must be at least 3 characters long')
    .max(255, 'Fullname is too long'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().default('Hey! there I\'m using Messenger.'),
  profilePicture: z.string().optional().default(''),
});

const updateUserSchema = z.object({
  accountId: z.string().uuid(),
  fullname: z
    .string()
    .min(3, 'Fullname must be at least 3 characters long')
    .max(255, 'Fullname is too long')
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profilePicture: z.string().optional(),
});

export class UserServices {
  // Create a user associated with an existing account
  async createUser(input: {
    accountId: string;
    fullname: string;
    bio: string;
    profilePicture: string;
  }) {
    // Validate input
    createUserSchema.parse(input);

    // Check if the account exists
    const user_account = await db
      .select()
      .from(account)
      .where(eq(account.id, input.accountId));

    if (user_account.length === 0) {
      throw new Error('DBError: Account does not exist');
    }

    // Insert the user record
    await db.insert(users).values({
      accountId: input.accountId,
      fullname: input.fullname,
      bio: input.bio,
      phone: user_account[0].phone, // Copy phone from the account
      profilePicture: input.profilePicture,
    });
  }

  // Retrieve a user by accountId
  async getUser({ accountId }: { accountId: string }) {
    // Ensure the accountId is a valid UUID
    z.string().uuid().parse(accountId);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.accountId, accountId));

    if (user.length === 0) {
      throw new Error('DBError: User does not exist');
    }

    return user[0]; // Return the first matching user
  }

  // Update a user's fullname and bio
  async updateUser(input: {
    accountId: string;
    fullname: string;
    bio: string;
    profilePicture: string;
  }) {
    // Validate input
    updateUserSchema.parse(input);

    // Ensure the account exists
    const user_account = await db
      .select()
      .from(account)
      .where(eq(account.id, input.accountId));

    if (user_account.length === 0) {
      throw new Error('DBError: Account does not exist');
    }

    // Perform the update
    await db
      .update(users)
      .set({
        fullname: input.fullname,
        bio: input.bio,
        profilePicture: input.profilePicture,
      })
      .where(eq(users.accountId, input.accountId));
  }

  // Add a contact
  async addContact(userId: string, contactId: string) {
    await db.insert(userContacts).values({
      userId,
      contactId,
    });
  }

  // Remove a contact
  async removeContact(userId: string, contactId: string): Promise<void> {
    await db
      .delete(userContacts)
      .where(
        and(
          eq(userContacts.userId, userId),
          eq(userContacts.contactId, contactId)
        )
      );
  }

  // Get all contacts for a user
  async getContacts(userId: string) {
    const contacts = await db
      .select()
      .from(userContacts)
      .where(eq(userContacts.userId, userId));

    // You can fetch additional user info here if needed
    const contactIds = contacts.map((contact) => contact.contactId);
    const filteredContactIds = contactIds.filter((id) => id !== null);
    return await db
      .select()
      .from(users)
      .where(inArray(users.id, filteredContactIds));
  }
}
