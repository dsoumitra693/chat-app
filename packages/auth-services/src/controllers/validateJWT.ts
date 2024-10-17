import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../utils/jwt';
import { searchAccount, account } from '../db';
import { eq } from 'drizzle-orm';

const validateJWT = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { token } = req.body;
    // Return a 400 Bad Request status if email or password is missing
    if (!token)
      return res
        .status(400)
        .send({ message: 'Invaid data recived from accounts.' });

    const _account = verifyJWT(token).data;
    console.log(_account)

    // // Search for the account in the database using the provided email
    const accounts = await searchAccount(eq(account.id, _account.id));

    // If the account doesn't exist, return a 409 Conflict status
    if (accounts.length === 0)
      return res.status(409).send({ message: 'account does not exits' });

    res.status(200).send({ accountId: _account.id });
  }
);

export default validateJWT;
