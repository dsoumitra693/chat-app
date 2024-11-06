import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from 'shared';
import { DBService } from '../db';
import { users } from 'shared';
import { eq, or } from 'drizzle-orm';

const dbService = new DBService();

/**
 * Handler for reading user data based on userId or phone number.
 * 
 * @param req - Express request object, expecting `userId` and/or `phone` in the body.
 * @param res - Express response object, used to send back the result.
 * @param next - Next function to pass control to the next middleware in case of errors.
 * 
 * @returns {Promise<void>} Sends back a JSON response with the user data if found.
 * 
 * Error Handling:
 * - Returns a 400 status if neither `userId` nor `phone` is provided.
 * - Returns the retrieved user data if a match is found.
 */
export const readUsersData = 
  async ({ userId, phone }:{userId?:string; phone?:string}): Promise<{
    [x: string]: any;
}[]> => {


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
    const queryCondition = conditions.length > 1 ? or(...conditions) : conditions[0];

    // Execute the database read operation
    const result = await dbService.read(queryCondition, users);

    return result
  }

/**
 * Handler for deleting user data based on userId or phone number.
 * 
 * @param req - Express request object, expecting `userId` and/or `phone` in the body.
 * @param res - Express response object, used to send back the result.
 * @param next - Next function to pass control to the next middleware in case of errors.
 * 
 * @returns {Promise<void>} Sends back a JSON response indicating the success or failure of the deletion.
 * 
 * Error Handling:
 * - Returns a 400 status if neither `userId` nor `phone` is provided.
 * - Returns the deleted user data if the deletion is successful.
 */
export const deleteUserData = async ({ userId, phone }:{ userId?:string; phone?:string }): Promise<boolean> => {

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
    const queryCondition = conditions.length > 1 ? or(...conditions) : conditions[0];

    // Execute the database delete operation
    const result = await dbService.delete(queryCondition, users);

    return !!result
  }
