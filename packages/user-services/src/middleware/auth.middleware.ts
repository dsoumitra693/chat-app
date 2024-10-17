import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import axios from 'axios';

/**
 * Middleware function to authenticate requests using JWT.
 * Extracts the token from the `Authorization` header and validates it by sending a request to the auth server.
 * If the token is valid, it adds the `accountId` to the request body and calls `next()`.
 * If no token is provided, or validation fails, a 401 Unauthorized status is returned.
 *
 * @param req - The Express `Request` object, containing the incoming HTTP request.
 * @param res - The Express `Response` object, used to send the response.
 * @param next - The next middleware function in the stack.
 */
export const authenticate = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Extract the JWT token from the header
      const response = await axios.post(
        `${process.env.AUTH_SERVER_URL}/auth/jwt/validate/`,
        {
          token,
        }
      );
      // Add the accountId from the validated token response to the request body
      req.body.accountId = response.data.accountId;
      next(); // Proceed to the next middleware or route handler
    } else {
      res.sendStatus(401); // Unauthorized
    }
  }
);
