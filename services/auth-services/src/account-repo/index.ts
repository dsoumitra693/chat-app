import { sql } from 'drizzle-orm';
import { DB, db } from '../db';
import { accountSchema } from '../db/schema';

export class AccountRepo {
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
  public async getAccount(query: string): Promise<any> {
    return await db
      .select({
        id: accountSchema.id,
        phone: accountSchema.phone,
        password: accountSchema.password,
      })
      .from(accountSchema)
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
  public async deleteAccount(query: string): Promise<any> {
    await db.delete(accountSchema).where(sql`${sql.raw(query)}`);
    return true;
  }
}
