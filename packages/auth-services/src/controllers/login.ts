import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { searchAccount, account } from '../db';
import { createJWT } from '../utils/jwt';
import { eq } from 'drizzle-orm';

// Controller function for handling account login
// Wrapped in asyncErrorHandler to handle any async errors gracefully
const logIn = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    let { phone, password } = req.body;

    // Return a 400 Bad Request status if phone or password is missing
    if (!phone || !password)
      return res
        .status(400)
        .send({ message: 'Invaid data recived from accounts.' });

    // Search for the account in the database using the provided phone
    const accounts = await searchAccount(eq(account.phone, phone));

    // If the account doesn't exist, return a 409 Conflict status
    if (accounts.length === 0)
      return res.status(409).send({ message: 'phone does not exits' });

    // If the password is incorrect, return a 401 Unauthorized status
    if (!accounts[0].authenticate(password))
      return res.status(401).send({ message: 'Password does not match' });

    // If everything is correct, return a 200 OK status and send the account's JWT
    const jwt = createJWT(accounts[0].json());

    return res.status(200).send({ jwt });
  }
);

export default logIn;
