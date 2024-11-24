import { NextFunction, Request, Response } from 'express';
import { bloomFilter, BloomFilter } from '../../redis/bloomfilters';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { getHash } from '../../utils/password';
import { generateUUID } from '../../utils/uuid';
import { createJWT } from '../../utils/jwt';
import { Account } from '../../services/account';
import { jwtStore } from '../../redis/jwt-store';

/**
 * Controller function for handling user sign-up.
 *
 * @async
 * @function signUp
 * @param {Request} req - The Express request object containing the user's sign-up data.
 *                         It should include the following fields in the request body:
 *                         - `phone`: The user's phone number.
 *                         - `password`: The user's password.
 * @param {Response} res - The Express response object used to send back the desired HTTP response.
 *                          It returns a `200 OK` with a JWT and account details if sign-up is successful.
 *                          It returns an error response if sign-up fails (e.g., phone already exists).
 * @param {NextFunction} next - The Express next middleware function to pass control to the next middleware if needed.
 *
 * @returns {Promise<void>} - Sends back a JWT and account information if sign-up is successful,
 *                            or an error message with the appropriate status code if unsuccessful.
 *
 * This function is wrapped in `asyncErrorHandler` to catch and handle any asynchronous errors gracefully.
 *
 * @throws {400} - If required fields (`phone`, `password`) are missing or if the phone already exists.
 */
export const signUp = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    const { phone, password } = req.body;

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
    const isAccountExists = await bloomFilter.check(phone);

    // If the account already exists, return a 400 Bad Request response
    if (isAccountExists) {
      return res.status(400).send({
        success: false,
        message: 'Phone already exists.',
        errorCode: 'PHONE_EXISTS',
        data: null,
      });
    }

    // Hash the password before storing it
    const hashedPassword = getHash(password);

    // Generate a new UUID for the new account
    const id = generateUUID();

    let account = new Account(phone, hashedPassword, id);
    await bloomFilter.add(phone);
    account.save();

    // Create a JWT for the new user
    // Create a new JWT for the account
    const token = createJWT(account);

    jwtStore.store(
      token,
      JSON.stringify({
        phone: account.phone,
        id: account.id,
      })
    );

    // Return a 200 OK status with a success message and the JWT
    res.status(200).send({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        account,
      },
    });
  }
);

export default signUp;
