import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import axios from 'axios';

export const authenticate = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const response = await axios.post(
        `${process.env.AUTH_SERVER_URL}/auth/jwt/validate/`,
        {
          token,
        }
      );
      req.body.accountId = response.data.accountId;
      next();
    } else {
      res.sendStatus(401); // Unauthorized
    }
  }
);
