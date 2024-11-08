import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from 'shared';
import { DBService } from '../db';
import { users } from 'shared';
import { eq, or } from 'drizzle-orm';

const dbService = new DBService();

/**
 * Handler for reading user data based on `userId` or `phone` number.
 * The function retrieves the user data from the database by checking the provided 
 * `userId` and/or `phone`. If both are provided, it uses an OR condition to match either.
 *
 * @param {Object} params - The input parameters for the request.
 * @param {string} [params.userId] - The user ID to query for (optional).
 * @param {string} [params.phone] - The phone number to query for (optional).
 * 
 * @returns {Promise<{[key: string]: any}>} 
 *   - Resolves to the user data if a match is found, or an empty object if no matching user is found.
 * 
 * @throws {Error} - Throws an error if the database query fails.
 * 
 * @example
 * // Usage:
 * const userData = await readUsersData({ userId: '12345', phone: '9876543210' });
 */
export const readUsersData = async ({
  userId,
  phone,
}: {
  userId?: string;
  phone?: string;
}): Promise<{
  [x: string]: any;
}> => {
  // Initialize an array to hold conditions
  const conditions = [];

  // Add the userId condition if it's provided
  if (userId) {
    conditions.push(eq(users.id, userId));
  }

  // Add the phone condition if it's provided
  if (phone) {
    conditions.push(eq(users.phone, phone));
  }

  // Use `or` if there are multiple conditions, otherwise use the single condition
  const queryCondition =
    conditions.length > 1 ? or(...conditions) : conditions[0];

  // Execute the database read operation
  const result = await dbService.read(queryCondition, users);
  // Handle the case where no records are found
  if (result.length === 0) return {};

  return result[0];
};

/**
 * Handler for deleting user data based on `userId` or `phone` number.
 * This function deletes a user matching either the `userId` or `phone` provided in the request.
 * If both are provided, it deletes the user matching either condition.
 *
 * @param {Object} params - The input parameters for the request.
 * @param {string} [params.userId] - The user ID to delete (optional).
 * @param {string} [params.phone] - The phone number to delete (optional).
 * 
 * @returns {Promise<boolean>} 
 *   - Resolves to `true` if the user was successfully deleted, `false` if no matching user was found.
 * 
 * @throws {Error} - Throws an error if the database query fails.
 * 
 * @example
 * // Usage:
 * const wasDeleted = await deleteUserData({ userId: '12345', phone: '9876543210' });
 */
export const deleteUserData = async ({
  userId,
  phone,
}: {
  userId?: string;
  phone?: string;
}): Promise<boolean> => {
  // Initialize an array to hold conditions
  const conditions = [];

  // Add the userId condition if it's provided
  if (userId) {
    conditions.push(eq(users.id, userId));
  }

  // Add the phone condition if it's provided
  if (phone) {
    conditions.push(eq(users.phone, phone));
  }

  // Use `or` if there are multiple conditions, otherwise use the single condition
  const queryCondition =
    conditions.length > 1 ? or(...conditions) : conditions[0];

  // Execute the database delete operation
  const result = await dbService.delete(queryCondition, users);

  return !!result;
};
