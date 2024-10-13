import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { db, searchAccount, account } from '../db';
import { eq } from 'drizzle-orm';

// Controller function for handling email change requests
// Wrapped in asyncErrorHandler to manage async errors efficiently
const changeEmail = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract the previous email, new email, and password from the request body
    let { previousPhone, newPhone, password } = req.body;

    // Return a 400 Bad Request status if any required fields are missing
    if (!previousPhone || !newPhone || !password)
      return res.status(400).send({ error: 'Missing required fields' });

    // Search for the account with the previous email address
    const accounts = await searchAccount(eq(account.phone, previousPhone));

    // If the account does not exist, return a 409 Conflict status
    if (!accounts[0]) return res.status(404).send({ error: 'account not found' });

    // If the old password does not match, return a 401 Unauthorized status
    if (!accounts[0].authenticate(password))
      return res.status(401).send({ error: 'Incorrect old password' });

    // Check if the new email already exists
    let existingaccountWithNewPhone = await searchAccount(eq(account.phone, newPhone));

    // If there is already a account with the new email, return a 409 Conflict status
    if (existingaccountWithNewPhone[0]) return res.sendStatus(409);

    // Update the account's email with the new email address
    await db
      .update(account)
      .set({ phone: newPhone }) // Set the new email
      .where(eq(account.phone, previousPhone));

    // Return a 200 OK status
    return res.status(200).send({ message: 'Email updated successfully' });
  }
);

export default changeEmail;
