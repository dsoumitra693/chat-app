import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from 'shared';
import { DBService } from '../db';
import { account } from 'shared';
import { eq, or } from 'drizzle-orm';

const dbService = new DBService();

export const readAccountData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accountId, phone } = req.body;

    // Check if neither accountId nor phone is provided
    if (!accountId && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data received',
        errorCode: 'INVALID_DATA',
        data: null,
      });
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
      return res.status(404).json({
        success: false,
        message: 'No accounts found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: result,
    });
  }
);

export const deleteAccountData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accountId, phone } = req.body;

    // Check if neither accountId nor phone is provided
    if (!accountId && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data received',
        errorCode: 'INVALID_DATA',
        data: null,
      });
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
    if (result) { // Assuming `result` indicates number of deleted rows
      return res.status(404).json({
        success: false,
        message: 'No accounts deleted, matching records not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data deleted successfully',
      data: result, // You might want to return the deleted account's data if needed
    });
  }
);
