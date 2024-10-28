import { db } from './db'; // Drizzle db instance
import { account } from './schema'; // Drizzle user schema
import { Account } from '../account';
import { getHash } from '../utils/password';
import { eq } from 'drizzle-orm';
import { generateUUID } from '../utils/uuid';

export { db, account };

/**
 * Function to search for users in the database based on the provided query.
 *
 * @async
 * @function searchAccount
 * @param {any} query - The query criteria for searching accounts in the database.
 * @returns {Promise<Account[]>} - A promise that resolves to an array of Account instances.
 *
 * This function catches any errors during the search and logs them, returning an empty array if an error occurs.
 */
export const searchAccount = async (query: any): Promise<Account[]> => {
  try {
    const data = await db.select().from(account).where(query);
    return data.map(
      (account) => new Account(account.phone, account.password, account.id)
    ) as Account[];
  } catch (error) {
    console.error('Error searching for users:', error);
    return [];
  }
};