import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { db, searchAccount, account } from '../db';
import { getHash } from '../utils/password';
import { createJWT } from '../utils/jwt';
import { eq } from 'drizzle-orm';

/**
 * Controller function to handle password change requests.
 * 
 * @param req - Express Request object containing the request data
 * @param res - Express Response object used to send a response back to the client
 * @param next - Express NextFunction to pass control to the next middleware
 * 
 * This function checks if the provided old password is correct and updates the account with the new password. 
 * If successful, it returns a JWT for the updated account.
 * 
 * @throws 400 Bad Request - If required fields (phone, newPass, oldPass) are missing.
 * @throws 404 Not Found - If the account associated with the provided phone number is not found.
 * @throws 401 Unauthorized - If the old password provided is incorrect.
 * @returns 200 OK - If the password is updated successfully, it returns the new JWT for the user.
 */
const changePass = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone, new password, and old password from the request body
    let { phone, newPass, oldPass } = req.body;

    // Return a 400 Bad Request status if any required fields are missing
    if (!phone || !newPass || !oldPass)
      return res.status(400).send({ error: 'Missing required fields' });

    // Search for the account in the database using the provided phone
    let accounts = await searchAccount(eq(account.phone, phone));

    // If the account does not exist, return a 404 Not Found status
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

    // Create a new JWT for the account
    const jwt = createJWT({ id: accounts[0].id });

    // Return a 200 OK status and send the account's updated JWT
    return res.status(200).send({ jwt });
  }
);

export default changePass;
