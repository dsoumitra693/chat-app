import { sql, eq } from 'drizzle-orm';
import { db, DB } from '../db';
import {
  userContactsSchema,
  userSettingsSchema,
  usersSchema,
} from '../db/schema';

export class UserRepo {
  db: DB;

  constructor() {
    this.db = db;
  }
  /**
   * Fetches an account by either phone number or account ID.
   *
   * @param {Object} params - The parameters for fetching the account.
   * @param {string} [params.phone] - The phone number associated with the account.
   * @param {string} [params.accountId] - The account ID to retrieve.
   * @returns {Promise<Account>} - A promise that resolves to the account if found.
   * @throws {Error} - If there is an error with the gRPC call or the account doesn't exist.
   */
  public async getUsers(query: string): Promise<any> {
    return await db
      .select()
      .from(usersSchema)
      .where(sql`${sql.raw(query)}`);
  }
  /**
   * Deletes an account by phone number or account ID.
   *
   * @param {Object} params - The parameters for deleting the account.
   * @param {string} [params.phone] - The phone number associated with the account.
   * @param {string} [params.accountId] - The account ID to delete.
   * @returns {Promise<any>} - A promise that resolves with the response if successful.
   * @throws {Error} - If there is an error with the gRPC call.
   */
  public async deleteUsers(query: string): Promise<any> {
    await db.delete(usersSchema).where(sql`${sql.raw(query)}`);
    return true;
  }

  public async getUserContacts(query: string): Promise<any> {
    return await db
      .select({
        id: userContactsSchema.id,
        userId: userContactsSchema.userId,
        contactUserId: userContactsSchema.contactUserId,
        contactUserProfile: {
          id: usersSchema.id,
          fullname: usersSchema.fullname,
          bio: usersSchema.bio,
          phone: usersSchema.phone,
          profilePicture: usersSchema.profilePicture,
          accountId: usersSchema.accountId,
        },
      })
      .from(userContactsSchema)
      .leftJoin(
        usersSchema,
        eq(usersSchema.id, userContactsSchema.contactUserId)
      )
      .where(sql`${sql.raw(query)}`);
  }
  /**
   * Deletes an account by phone number or account ID.
   *
   * @param {Object} params - The parameters for deleting the account.
   * @param {string} [params.phone] - The phone number associated with the account.
   * @param {string} [params.accountId] - The account ID to delete.
   * @returns {Promise<any>} - A promise that resolves with the response if successful.
   * @throws {Error} - If there is an error with the gRPC call.
   */
  public async deleteUserContacts(query: string): Promise<any> {
    await db.delete(userContactsSchema).where(sql`${sql.raw(query)}`);
    return true;
  }

  public async getUserSettings(query: string): Promise<any> {
    return await db
      .select()
      .from(userSettingsSchema)
      .where(sql`${sql.raw(query)}`);
  }
  /**
   * Deletes an account by phone number or account ID.
   *
   * @param {Object} params - The parameters for deleting the account.
   * @param {string} [params.phone] - The phone number associated with the account.
   * @param {string} [params.accountId] - The account ID to delete.
   * @returns {Promise<any>} - A promise that resolves with the response if successful.
   * @throws {Error} - If there is an error with the gRPC call.
   */
  public async deleteUserSettings(query: string): Promise<any> {
    await db.delete(userSettingsSchema).where(sql`${sql.raw(query)}`);
    return true;
  }
}
