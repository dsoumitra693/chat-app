import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { db, searchUser, user } from '../db';
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

    // Search for the user with the previous email address
    const users = await searchUser(eq(user.phone, previousPhone));

    // If the user does not exist, return a 409 Conflict status
    if (!users[0]) return res.status(404).send({ error: 'User not found' });

    // If the old password does not match, return a 401 Unauthorized status
    if (!users[0].authenticate(password))
      return res.status(401).send({ error: 'Incorrect old password' });

    // Check if the new email already exists
    let existingUserWithNewPhone = await searchUser(eq(user.phone, newPhone));

    // If there is already a user with the new email, return a 409 Conflict status
    if (existingUserWithNewPhone[0]) return res.sendStatus(409);

    // Update the user's email with the new email address
    await db
      .update(user)
      .set({ phone: newPhone }) // Set the new email
      .where(eq(user.phone, previousPhone));

    // Return a 200 OK status
    return res.status(200).send({ message: 'Email updated successfully' });
  }
);

export default changeEmail;
