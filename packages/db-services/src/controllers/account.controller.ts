import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from 'shared';
import { DBService } from '../db';
import { account } from 'shared';
import { eq, or } from 'drizzle-orm';

const dbService = new DBService();

/**
 * Handler for reading account data based on accountId or phone number.
 * 
 * @param req - Express request object, expecting `accountId` and/or `phone` in the body.
 * @param res - Express response object, used to send back the result.
 * @param next - Next function to pass control to the next middleware in case of errors.
 * 
 * @returns {Promise<void>} Sends back a JSON response with the account data if found, or a 404 status if not.
 * 
 * Error Handling:
 * - Returns a 400 status if neither `accountId` nor `phone` is provided.
 * - Returns a 404 status if no matching account is found.
 */
export const readAccountData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { accountId, phone } = req.body;

    // Check if neither accountId nor phone is provided
    if (!accountId && !phone) {
      res.status(400).json({
        success: false,
        message: 'Invalid data received',
        errorCode: 'INVALID_DATA',
        data: null,
      });
      return
    }

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
    const queryCondition = conditions.length > 1 ? or(...conditions) : conditions[0];

    // Execute the database read operation
    const result = await dbService.read(queryCondition, account);

    // Handle the case where no records are found
    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No accounts found',
        data: null,
      });
      return
    }

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: result,
    });
  }
);

/**
 * Handler for deleting account data based on accountId or phone number.
 * 
 * @param req - Express request object, expecting `accountId` and/or `phone` in the body.
 * @param res - Express response object, used to send back the result.
 * @param next - Next function to pass control to the next middleware in case of errors.
 * 
 * @returns {Promise<void>} Sends back a JSON response indicating the success or failure of the deletion.
 * 
 * Error Handling:
 * - Returns a 400 status if neither `accountId` nor `phone` is provided.
 * - Returns a 404 status if no account matching the provided details was deleted.
 */
export const deleteAccountData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { accountId, phone } = req.body;

    // Check if neither accountId nor phone is provided
    if (!accountId && !phone) {
      res.status(400).json({
        success: false,
        message: 'Invalid data received',
        errorCode: 'INVALID_DATA',
        data: null,
      });
      return
    }

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
    const queryCondition = conditions.length > 1 ? or(...conditions) : conditions[0];

    // Execute the database delete operation
    const result = await dbService.delete(queryCondition, account);

    // Check if any records were deleted
    if (!result) { // Assuming `result` indicates number of deleted rows
      res.status(404).json({
        success: false,
        message: 'No accounts deleted, matching records not found',
        data: null,
      });
      return
    }

    res.status(200).json({
      success: true,
      message: 'Data deleted successfully',
      data: result, // You might want to return the deleted account's data if needed
    });
  }
);
