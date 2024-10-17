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

    // Return a 400 Bad Request status if phone or password is missing
    if (!phone || !password) {
      return res
        .status(400)
        .send({ message: 'Invalid data received from accounts.' });
    }

    // Search for the account in the database using the provided phone
    const accounts = await searchAccount(eq(account.phone, phone));

    // If the account doesn't exist, return a 409 Conflict status
    if (accounts.length === 0) {
      return res.status(409).send({ message: 'Phone does not exist' });
    }

    // If the password is incorrect, return a 401 Unauthorized status
    if (!accounts[0].authenticate(password)) {
      return res.status(401).send({ message: 'Password does not match' });
    }
    console.log(accounts[0]);

    // If everything is correct, return a 200 OK status and send the account's JWT
    const jwt = createJWT({ id: accounts[0].id });

    return res.status(200).send({
      jwt,
      account: { accountId: accounts[0].id, phone: accounts[0].phone },
    });
  }
);

export default logIn;
