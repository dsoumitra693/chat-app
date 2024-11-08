import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { createJWT } from '../utils/jwt';
import { getAccount } from '../db';

/**
 * Controller function for handling account login.
 * 
 * @async
 * @function logIn
 * @param {Request} req - The Express request object containing the user's login data. 
 *                         It should include the following fields in the request body:
 *                         - `phone`: The user's phone number.
 *                         - `password`: The user's password.
 * @param {Response} res - The Express response object used to send back the desired HTTP response. 
 *                          It returns a `200 OK` with the JWT and account details if login is successful.
 *                          It returns an appropriate error response if login fails.
 * @param {NextFunction} next - The Express next middleware function to pass control to the next middleware if needed.
 * 
 * @returns {Promise<void>} - Sends back a JWT and account information if login is successful, 
 *                            or an error message with the appropriate status code if unsuccessful.
 * 
 * This function is wrapped in `asyncErrorHandler` to handle any asynchronous errors gracefully.
 * 
 * @throws {400} - If required fields (`phone`, `password`) are missing.
 * @throws {409} - If no account exists with the provided `phone`.
 * @throws {401} - If the provided `password` does not match the stored password.
 */
const logIn = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    const { phone, password } = req.body;

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
    const accounts = await getAccount({ phone });

    // If the account doesn't exist, return a standardized 409 Conflict response
    if (!accounts) {
      return res.status(409).send({
        success: false,
        message: 'Phone does not exist.',
        errorCode: 'PHONE_NOT_FOUND',
        data: {},
      });
    }

    // If the password is incorrect, return a standardized 401 Unauthorized response
    if (!accounts.authenticate(password)) {
      return res.status(401).send({
        success: false,
        message: 'Password does not match.',
        errorCode: 'INVALID_PASSWORD',
        data: {},
      });
    }

    // If everything is correct, return a standardized 200 OK response with the JWT
    const jwt = createJWT({ id: accounts.id });

    return res.status(200).send({
      success: true,
      message: 'Login successful.',
      data: {
        jwt,
        account: { accountId: accounts.id, phone: accounts.phone },
      },
    });
  }
);

export default logIn;
