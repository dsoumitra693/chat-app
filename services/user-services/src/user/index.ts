import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { KafkaService } from '../kafka';
import { grpcClient } from '../grpc';
import { generateUUID } from '../utils/uuid';

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
  async getUser({
    phone,
    userId,
  }: {
    phone?: string;
    userId?: string;
  }): Promise<Object> {
    return new Promise((resolve, reject) => {
      grpcClient.GetUser({ phone, userId }, (error: any, response: any) => {
        if (error) {
          reject(new Error(`Failed to fetch user: ${error.message}`));
        } else if (!response || !response.user) {
          reject(new Error('User not found'));
        } else {
          resolve(response.user);
        }
      });
    });
  }
  /**
   * Adds a contact for a user.
   *
   * @param userId - The ID of the user.
   * @param contactId - The ID of the contact to add.
   */
  async addContact(userId: string, contactPhone: string) {
    const id = generateUUID();

    await kafkaService.produce(
      'contact.create',
      id,
      JSON.stringify({
        id,
        userId,
        contactPhone,
      })
    );
    return id;
  }

  /**
   * Removes a contact from a user's contact list.
   *
   * @param userId - The ID of the user.
   * @param contactId - The ID of the contact to remove.
   */
  async removeContact(
    contactId: string,
    userId?: string,
    contactUserId?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      grpcClient.DeleteContact(
        { contactId, userId, contactUserId },
        (error: any, response: any) => {
          if (error) {
            reject(new Error(`Failed to delete contact: ${error.message}`));
          } else if (!response || !response.status) {
            reject(new Error('Contact not found'));
          } else {
            resolve(response.status);
          }
        }
      );
    });
  }

  /**
   * Retrieves all contacts for a user.
   *
   * @param userId - The ID of the user whose contacts are to be retrieved.
   *
   * @returns An array of user objects representing the contacts.
   */
  async getContacts(
    contactId: string,
    userId?: string,
    contactUserId?: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      grpcClient.GetContact(
        { contactId, userId, contactUserId },
        (error: any, response: any) => {
          if (error) {
            reject(new Error(`Failed to fetch contact: ${error.message}`));
          } else if (!response || !response.contact) {
            reject(new Error('Contact not found'));
          } else {
            resolve(response.contact);
          }
        }
      );
    });
  }
}
