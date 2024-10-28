import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { searchAccount } from '../db';
import { createJWT } from '../utils/jwt';
import { produceToKafka } from '../producers';
import { account, generateUUID } from 'shared';
import { eq } from 'drizzle-orm';
import { getHash } from '../utils/password';

/**
 * Controller function for handling user sign-up.
 *
 * @async
 * @function signUp
 * @param {Request} req - The Express request object containing the user's sign-up data.
 * @param {Response} res - The Express response object used to send back the desired HTTP response.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} - Sends back a JWT and account information if sign-up is successful,
 *                            or an error message with the appropriate status code if unsuccessful.
 *
 * This function is wrapped in `asyncErrorHandler` to catch and handle any asynchronous errors.
 */
export const signUp = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    let { phone, password } = req.body;
    const id = generateUUID();

    // Return a standardized 400 Bad Request response if phone or password is missing
    if (!phone || !password) {
      return res.status(400).send({
        success: false,
        message: 'Invalid data received from users.',
        errorCode: 'INVALID_INPUT',
        data: null,
      });
    }

    // Check if an Account with the given phone already exists
    const accounts = await searchAccount(eq(account.phone, phone));
    password = getHash(password);

    if (accounts.length > 0)
      return res.status(400).send({
        success: false,
        message: 'Phone already exists.',
        errorCode: 'PHONE_EXISTS',
        data: null,
      });

    produceToKafka('account.create', phone, { id, phone, password });

    // Create a JWT for the new user
    const jwt = createJWT({ id });

    // Return a 200 OK status with a success message and the JWT
    return res.status(200).send({
      success: true,
      message: 'Account created successfully',
      data: {
        jwt,
        account: { accountId: id, phone },
      },
    });
  }
);

export default signUp;
