import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { db, searchAccount, account } from '../db';
import { getHash } from '../utils/password';
import { createJWT } from '../utils/jwt';
import { eq } from 'drizzle-orm';

// Controller function for handling password change requests
// Wrapped in asyncErrorHandler to manage async errors effectively
const changePass = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone, new password, and old password from the request body
    let { phone, newPass, oldPass } = req.body;

    // Return a 400 Bad Request status if any required fields are missing
    if (!phone || !newPass || !oldPass)
      return res.status(400).send({ error: 'Missing required fields' });

    // Search for the account in the database using the provided phone
    let accounts = await searchAccount(eq(account.phone, phone));

    // If the account does not exist, return a 409 Conflict status
    if (!accounts[0])
      return res.status(404).send({ error: 'account not found' });

    // If the old password does not match, return a 401 Unauthorized status
    if (!accounts[0].authenticate(oldPass))
      return res.status(401).send({ error: 'Incorrect old password' });

    // Update the account's password with the new password
    await db
      .update(account)
      .set({ password: getHash(newPass) })
      .where(eq(account.phone, phone));

    const jwt = createJWT(accounts[0].json());
    // Return a 200 OK status and send the account's updated JWT
    return res.status(200).send({ jwt });
  }
);

export default changePass;
