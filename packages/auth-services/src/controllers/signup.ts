import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { createAccount } from '../db';
import { createJWT } from '../utils/jwt';

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

    // Return a standardized 400 Bad Request response if phone or password is missing
    if (!phone || !password) {
      return res.status(400).send({
        success: false,
        message: 'Invalid data received from users.',
        errorCode: 'INVALID_INPUT',
        data: null
      });
    }

    // Attempt to create a new user with the provided phone and password
    let { response, error } = await createAccount(phone, password);

    // If user creation fails (e.g., phone already exists), return a standardized 409 Conflict response
    if (!response || error) {
      return res.status(409).send({
        success: false,
        message: error?.message || 'Account creation failed.',
        errorCode: 'ACCOUNT_CONFLICT',
        data: null
      });
    }

    // Create a JWT for the new user
    const jwt = createJWT({ id: response.id });

    // Return a 200 OK status with a success message and the JWT
    return res.status(200).send({
      success: true,
      message: 'Account created successfully',
      data: {
        jwt,
        account: { accountId: response.id, phone: response.phone }
      }
    });
  }
);

export default signUp;
