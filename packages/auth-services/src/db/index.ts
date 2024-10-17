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

/**
 * Function to create a new user in the database.
 *
 * @async
 * @function createAccount
 * @param {string} phone - The phone number of the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<{ response: Account | undefined; error: Error | undefined }>} - A promise that resolves to an object containing either the newly created Account or an error.
 *
 * This function checks if an account with the given phone number already exists, hashes the password, 
 * and inserts the new user record into the database. It returns the created account or an error message.
 */
export const createAccount = async (
  phone: string,
  password: string
): Promise<
  | { response: Account; error: undefined }
  | { response: undefined; error: Error }
> => {
  let response: Account | undefined, error: Error | undefined;
  password = getHash(password); // Hash the password

  try {
    // Check if an Account with the given phone already exists
    const accounts = await searchAccount(eq(account.phone, phone));

    if (accounts.length > 0) throw new Error('Email already exists.');

    // Create a new User instance for validation or additional logic
    const newUser = new Account(phone, password, generateUUID());

    // Insert a new user record in the database using Drizzle
    await db.insert(account).values({
      phone: newUser.phone,
      password: newUser.password,
      id: newUser.id, // Ensure password is securely handled
    });

    // Success: set response, and error should be undefined
    response = newUser;
  } catch (err) {
    // Failure: set error, and response should be undefined
    error = err as Error;
  }

  // Return in the correct format based on success or failure
  if (response) {
    return { response, error: undefined };
  } else {
    return { response: undefined, error: error as Error };
  }
};
