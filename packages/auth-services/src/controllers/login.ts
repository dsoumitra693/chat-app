import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { searchAccount, account } from '../db';
import { createJWT } from '../utils/jwt';
import { eq } from 'drizzle-orm';

/**
 * Controller function for handling account login.
 * 
 * @async
 * @function logIn
 * @param {Request} req - The Express request object containing the user's login data.
 * @param {Response} res - The Express response object used to send back the desired HTTP response.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} - Sends back a JWT and account information if login is successful, 
 *                            or an error message with the appropriate status code if unsuccessful.
 * 
 * This function is wrapped in `asyncErrorHandler` to handle any asynchronous errors gracefully.
 */
const logIn = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    let { phone, password } = req.body;

    // Return a standardized 400 Bad Request response if phone or password is missing
    if (!phone || !password) {
      return res.status(400).send({
        success: false,
        message: 'Invalid data received from accounts.',
        errorCode: 'INVALID_INPUT',
        data: {},
      });
    }

    // Search for the account in the database using the provided phone
    const accounts = await searchAccount(eq(account.phone, phone));

    // If the account doesn't exist, return a standardized 409 Conflict response
    if (accounts.length === 0) {
      return res.status(409).send({
        success: false,
        message: 'Phone does not exist.',
        errorCode: 'PHONE_NOT_FOUND',
        data: {},
      });
    }

    // If the password is incorrect, return a standardized 401 Unauthorized response
    if (!accounts[0].authenticate(password)) {
      return res.status(401).send({
        success: false,
        message: 'Password does not match.',
        errorCode: 'INVALID_PASSWORD',
        data: {},
      });
    }
    console.log(accounts[0]);

    // If everything is correct, return a standardized 200 OK response with the JWT
    const jwt = createJWT({ id: accounts[0].id });

    return res.status(200).send({
      success: true,
      message: 'Login successful.',
      data: {
        jwt,
        account: { accountId: accounts[0].id, phone: accounts[0].phone },
      },
    });
  }
);

export default logIn;
