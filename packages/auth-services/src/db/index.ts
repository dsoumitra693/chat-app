import { db } from './db'; // Drizzle db instance
import { account } from './schema'; // Drizzle user schema
import { Account } from '../account';
import { getHash } from '../utils/password';
import { eq } from 'drizzle-orm';
import { generateUUID } from '../utils/uuid';

export { db, account };

// Function to search for users in the database
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

// Function to create a new user in the database
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
    // Check if a Account with the given phone already exists
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
