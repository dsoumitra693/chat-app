import { db } from "./db"; // Drizzle db instance
import { user } from "./schema"; // Drizzle user schema
import { User } from "../user";
import { getHash } from "../utils/password";
import { eq } from "drizzle-orm";

export { db, user };

// Function to search for users in the database
export const searchUser = async (query: any): Promise<User[]> => {
  try {
    const data = await db.select().from(user).where(query);
    return data.map(
      (user) => new User(user.phone, user.password, user.name)
    ) as User[];
  } catch (error) {
    console.error("Error searching for users:", error);
    return [];
  }
};

// Function to create a new user in the database
export const createUser = async (
  phone: string,
  password: string,
  name: string
): Promise<
  { response: User; error: undefined } | { response: undefined; error: Error }
> => {
  let response: User | undefined, error: Error | undefined;
  password = getHash(password); // Hash the password

  try {
    // Check if a user with the given phone already exists
    const users = await searchUser(eq(user.phone, phone));

    if (users.length > 0) throw new Error("Email already exists.");

    // Create a new User instance for validation or additional logic
    const newUser = new User(phone, password, name);

    // Insert a new user record in the database using Drizzle
    await db.insert(user).values({
      phone: newUser.getPhone(),
      password: newUser.getPassword(), // Ensure password is securely handled
      name: newUser.getName()!,
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
