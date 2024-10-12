import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { searchUser, user } from '../db';
import { createJWT } from '../utils/jwt';
import { eq } from 'drizzle-orm';

// Controller function for handling user login
// Wrapped in asyncErrorHandler to handle any async errors gracefully
const logIn = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone and password from the request body
    let { phone, password } = req.body;

    // Return a 400 Bad Request status if phone or password is missing
    if (!phone || !password)
      return res
        .status(400)
        .send({ message: 'Invaid data recived from users.' });

    // Search for the user in the database using the provided phone
    const users = await searchUser(eq(user.phone, phone));

    // If the user doesn't exist, return a 409 Conflict status
    if (users.length === 0)
      return res.status(409).send({ message: 'phone does not exits' });

    // If the password is incorrect, return a 401 Unauthorized status
    if (!users[0].authenticate(password))
      return res.status(401).send({ message: 'Password does not match' });

    // If everything is correct, return a 200 OK status and send the user's JWT
    const jwt = createJWT(users[0].json());

    return res.status(200).send({ jwt });
  }
);

export default logIn;
