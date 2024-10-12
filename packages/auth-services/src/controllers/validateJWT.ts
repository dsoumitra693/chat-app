import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../utils/jwt';
import { searchUser, user } from '../db';
import { eq } from 'drizzle-orm';

const validateJWT = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { token } = req.body;
    // Return a 400 Bad Request status if email or password is missing
    if (!token)
      return res
        .status(400)
        .send({ message: 'Invaid data recived from users.' });

    const _user = verifyJWT(token).data;

    // // Search for the user in the database using the provided email
    const users = await searchUser(eq(user.phone, _user.phone));

    // If the user doesn't exist, return a 409 Conflict status
    if (users.length === 0)
      return res.status(409).send({ message: 'User does not exits' });

    res.status(200).send({ user: _user });
  }
);

export default validateJWT;
