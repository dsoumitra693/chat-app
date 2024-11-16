import { DBService } from '../db';
import { eq, or } from 'drizzle-orm';
import { account } from '../db/schema';

const dbService = new DBService();

/**
 * Handler for reading account data based on `accountId` or `phone` number.
 * The function checks the database for an account matching either the provided `accountId`
 * or `phone`, and returns the account details if found.
 *
 * @param {Object} params - The input parameters for the request.
 * @param {string} params.accountId - The account ID to query for.
 * @param {string} params.phone - The phone number to query for.
 * 
 * @returns {Promise<{[key: string]: any} | {}}> 
 *   - Resolves to the account data if found, or an empty object if no account is found.
 * 
 * @throws {Error} - Throws an error if the database query fails.
 * 
 * @example
 * // Usage:
 * const accountData = await readAccountData({ accountId: '12345', phone: '9876543210' });
 */
export const readAccountData = async ({
  accountId,
  phone,
}: {
  accountId: string;
  phone: string;
}): Promise<{
  [x: string]: any;
} | {}> => {
  // Initialize an array to hold conditions
  const conditions = [];

  // Add the accountId condition if it's provided
  if (accountId) {
    conditions.push(eq(account.id, accountId));
  }

  // Add the phone condition if it's provided
  if (phone) {
    conditions.push(eq(account.phone, phone));
  }

  // Create the query condition
  const queryCondition =
    conditions.length > 1 ? or(...conditions) : conditions[0];

  // Execute the database read operation
  const result = await dbService.read(queryCondition, account);

  // Handle the case where no records are found
  if (result.length === 0) return {};

  return result[0];
};

/**
 * Handler for deleting account data based on `accountId` or `phone` number.
 * The function deletes an account matching either the provided `accountId` or `phone`
 * from the database.
 *
 * @param {Object} params - The input parameters for the request.
 * @param {string} params.accountId - The account ID to delete.
 * @param {string} params.phone - The phone number to delete.
 * 
 * @returns {Promise<boolean>} 
 *   - Resolves to `true` if the account was successfully deleted, `false` otherwise.
 * 
 * @throws {Error} - Throws an error if the database query fails.
 * 
 * @example
 * // Usage:
 * const wasDeleted = await deleteAccountData({ accountId: '12345', phone: '9876543210' });
 */
export const deleteAccountData = async ({
  accountId,
  phone,
}: {
  accountId: string;
  phone: string;
}): Promise<boolean> => {
  // Initialize an array to hold conditions
  const conditions = [];

  // Add the accountId condition if it's provided
  if (accountId) {
    conditions.push(eq(account.id, accountId));
  }

  // Add the phone condition if it's provided
  if (phone) {
    conditions.push(eq(account.phone, phone));
  }

  // Create the query condition
  const queryCondition =
    conditions.length > 1 ? or(...conditions) : conditions[0];

  // Execute the database delete operation
  const result = await dbService.delete(queryCondition, account);

  return !!result;
};
