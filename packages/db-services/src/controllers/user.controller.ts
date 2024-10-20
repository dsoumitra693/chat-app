import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from 'shared';
import { DBService } from '../db';
import { users } from 'shared';
import { eq, or } from 'drizzle-orm';

const dbService = new DBService();

export const readUsersData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, phone } = req.body;

    // Check if neither userId nor phone is provided
    if (!userId && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data received',
        errorCode: 'INVALID_DATA',
        data: null,
      });
    }

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

    // Use or if there are multiple conditions, otherwise use the single condition
    const queryCondition = conditions.length > 1 ? or(...conditions) : conditions[0];

    // Execute the database read operation
    const result = await dbService.read(queryCondition, users);

    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: result,
    });
  }
);

export const deleteUserData = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, phone } = req.body;

    // Check if neither userId nor phone is provided
    if (!userId && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data received',
        errorCode: 'INVALID_DATA',
        data: null,
      });
    }

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

    // Use or if there are multiple conditions, otherwise use the single condition
    const queryCondition = conditions.length > 1 ? or(...conditions) : conditions[0];

    // Execute the database delete operation
    const result = await dbService.delete(queryCondition, users);

    return res.status(200).json({
      success: true,
      message: 'Data deleted successfully',
      data: result,
    });
  }
);
