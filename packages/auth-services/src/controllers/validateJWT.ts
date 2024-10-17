import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../utils/jwt';
import { searchAccount, account } from '../db';
import { eq } from 'drizzle-orm';

/**
 * Middleware function to validate a JSON Web Token (JWT) and retrieve account information.
 *
 * @async
 * @function validateJWT
 * @param {Request} req - The Express request object containing the JWT to validate.
 * @param {Response} res - The Express response object used to send back the desired HTTP response.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} - Sends back the account ID if the JWT is valid and the account exists,
 *                            or an error message with the appropriate status code if unsuccessful.
 *
 * This function is wrapped in `asyncErrorHandler` to catch and handle any asynchronous errors.
 */
const validateJWT = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from the request body
    let { token } = req.body;

    // Return a 400 Bad Request status if token is missing
    if (!token) {
      return res
        .status(400)
        .send({ message: 'Invalid data received from accounts.' });
    }

    // Verify the JWT and extract account data
    const _account = verifyJWT(token).data;
    console.log(_account);

    // Search for the account in the database using the provided account ID
    const accounts = await searchAccount(eq(account.id, _account.id));

    // If the account doesn't exist, return a 409 Conflict status
    if (accounts.length === 0) {
      return res.status(409).send({ message: 'Account does not exist' });
    }

    // Send back the account ID if validation is successful
    res.status(200).send({ accountId: _account.id });
  }
);

export default validateJWT;
