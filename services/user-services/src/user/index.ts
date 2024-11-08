import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db/db';
import { account, userContacts, users } from '../db/schema';
import { KafkaService } from '../kafka';
import { generateUUID } from 'shared';

const kafkaService = new KafkaService();

// Validation schema using Zod
const createUserSchema = z.object({
  accountId: z.string().uuid(),
  fullname: z
    .string()
    .min(3, 'Fullname must be at least 3 characters long')
    .max(255, 'Fullname is too long')
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profilePicture: z.string().optional(),
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

/**
 * Service class for managing user-related operations.
 */
export class UserServices {
  /**
   * Creates a user associated with an existing account.
   *
   * @param input - The input data for creating a user.
   */
  async createUser(input: {
    accountId: string;
    fullname?: string;
    bio?: string;
    profilePicture?: string;
    phone: string;
  }) {
    // Validate input
    createUserSchema.parse(input);

    // Prepare the insert data
    const insertData: {
      accountId: string;
      fullname?: string;
      bio?: string;
      profilePicture?: string;
      phone: string;
      id: string;
    } = {
      id: generateUUID(),
      accountId: input.accountId,
      phone: input.phone, // Copy phone from the account
    };

    // Conditionally add fields if they are not empty or undefined
    if (input.fullname && input.fullname.trim()) {
      insertData.fullname = input.fullname.trim();
    }
    if (input.bio && input.bio.trim()) {
      insertData.bio = input.bio.trim();
    }
    if (input.profilePicture && input.profilePicture.trim()) {
      insertData.profilePicture = input.profilePicture.trim();
    }

    // Ensure that fields are defined and not undefined before insertion
    await kafkaService.produce('user.create', insertData.id, insertData);
  }

  /**
   * Updates a user's fullname, bio, and profile picture.
   *
   * @param input - The input data for updating the user.
   */
  async updateUser(input: {
    accountId: string;
    fullname?: string;
    bio?: string;
    profilePicture?: string;
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

    // Prepare an update object with only non-empty fields
    const updateFields: Partial<{
      fullname: string;
      bio: string;
      profilePicture: string;
      accountId: string;
    }> = {
      accountId: input.accountId,
    };

    if (input.fullname && input.fullname.trim()) {
      updateFields.fullname = input.fullname;
    }
    if (input.bio && input.bio.trim()) {
      updateFields.bio = input.bio;
    }
    if (input.profilePicture && input.profilePicture.trim()) {
      updateFields.profilePicture = input.profilePicture;
    }

    // Perform the update only if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      kafkaService.produce('user.update', input.accountId, updateFields);
      return input;
    }
  }
  /**
   * Retrieves a user by their account ID.
   *
   * @param accountId - The UUID of the account.
   *
   * @returns The user object associated with the account ID.
   *
   * @throws {Error} If the user does not exist.
   */
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
  /**
   * Adds a contact for a user.
   *
   * @param userId - The ID of the user.
   * @param contactId - The ID of the contact to add.
   */
  async addContact(userId: string, contactPhone: string) {
    const contact = await db
      .select()
      .from(users)
      .where(eq(users.phone, contactPhone));
    const id = generateUUID();
    console.log(contact, id)
    await db.insert(userContacts).values({
      id,
      userId,
      contactUserId: contact[0].id,
    });
    return {
      id,
      userId,
      contactUserId: contact[0].id,
    };
  }

  /**
   * Removes a contact from a user's contact list.
   *
   * @param userId - The ID of the user.
   * @param contactId - The ID of the contact to remove.
   */
  async removeContact(contactId: string): Promise<void> {
    await db.delete(userContacts).where(eq(userContacts.id, contactId));
  }

  /**
   * Retrieves all contacts for a user.
   *
   * @param userId - The ID of the user whose contacts are to be retrieved.
   *
   * @returns An array of user objects representing the contacts.
   */
  async getContacts(userId: string) {
    const contacts = await db
      .select()
      .from(userContacts)
      .where(eq(userContacts.userId, userId));

    // fetch additional user info
    const contactIds = contacts.map((contact) => contact.contactUserId);
    const filteredContactIds = contactIds.filter((id) => id !== null);
    return await db
      .select()
      .from(users)
      .where(inArray(users.id, filteredContactIds));
  }
}