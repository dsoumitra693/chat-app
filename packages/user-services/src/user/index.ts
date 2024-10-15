import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db/db';
import { account, users } from '../db/schema';

// Validation schema using Zod
const createUserSchema = z.object({
  accountId: z.string().uuid(),
  fullname: z.string().min(3, 'Fullname must be at least 3 characters long').max(255, 'Fullname is too long'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
});

const updateUserSchema = z.object({
  accountId: z.string().uuid(),
  fullname: z.string().min(3, 'Fullname must be at least 3 characters long').max(255, 'Fullname is too long'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
});

export class UserServices {
  // Create a user associated with an existing account
  async createUser(input: {
    accountId: string;
    fullname: string;
    bio: string;
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
      .set({ fullname: input.fullname, bio: input.bio })
      .where(eq(users.accountId, input.accountId));
  }
}
