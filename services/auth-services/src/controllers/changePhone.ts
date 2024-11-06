import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { db, searchAccount, account } from '../db';
import { eq } from 'drizzle-orm';

/**
 * Controller function to handle phone number change requests.
 * 
 * @param req - Express Request object containing the request data
 * @param res - Express Response object used to send a response back to the client
 * @param next - Express NextFunction to pass control to the next middleware
 * 
 * This function verifies if the provided password matches the existing account with the old phone number
 * and updates the account with a new phone number if successful.
 * 
 * @throws 400 Bad Request - If required fields (previousPhone, newPhone, password) are missing.
 * @throws 404 Not Found - If the account associated with the provided previous phone number is not found.
 * @throws 401 Unauthorized - If the password provided is incorrect.
 * @throws 409 Conflict - If the new phone number is already associated with another account.
 * @returns 200 OK - If the phone number is updated successfully, it sends a success message.
 */
const changePhone = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract the previous phone, new phone, and password from the request body
    let { previousPhone, newPhone, password } = req.body;

    // Return a standardized 400 Bad Request response if any required fields are missing
    if (!previousPhone || !newPhone || !password) {
      return res.status(400).send({
        success: false,
        message: 'Missing required fields',
        errorCode: 'INVALID_INPUT',
        data: null
      });
    }

    // Search for the account with the previous phone number
    const accounts = await searchAccount(eq(account.phone, previousPhone));

    // If the account does not exist, return a 404 Not Found response
    if (!accounts[0]) {
      return res.status(404).send({
        success: false,
        message: 'Account not found',
        errorCode: 'ACCOUNT_NOT_FOUND',
        data: null
      });
    }

    // If the password does not match, return a 401 Unauthorized response
    if (!accounts[0].authenticate(password)) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect old password',
        errorCode: 'INVALID_PASSWORD',
        data: null
      });
    }

    // Check if the new phone number is already associated with another account
    let existingAccountWithNewPhone = await searchAccount(eq(account.phone, newPhone));

    // If an account with the new phone number already exists, return a 409 Conflict response
    if (existingAccountWithNewPhone[0]) {
      return res.status(409).send({
        success: false,
        message: 'New phone number already in use',
        errorCode: 'PHONE_CONFLICT',
        data: null
      });
    }

    // Update the account's phone number with the new phone number
    await db
      .update(account)
      .set({ phone: newPhone })
      .where(eq(account.phone, previousPhone));

    // Return a 200 OK status with a success message
    return res.status(200).send({
      success: true,
      message: 'Phone number updated successfully',
      data: { accountId: accounts[0].id, newPhone }
    });
  }
);

export default changePhone;
