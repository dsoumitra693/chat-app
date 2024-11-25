import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';

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
    try {
      const response = await axios.post(
        `${process.env.AUTH_SERVER_URL}/auth/jwt/validate/`,
        {},
        {
          headers: req.headers,
        }
      );
      // Add the accountId from the validated token response to the request body
      req.body.account = response.data.data;
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Handle errors from the token validation process
      if (axios.isAxiosError(error) && error.response) {
        // Check if the error has a response from the server
        res.status(error.response.status).json({
          status: 'error',
          message: 'Token validation failed',
          data: null, // You can include more details in the response if needed
        });
      } else {
        // Handle other possible errors
        res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
          data: null,
        });
      }
    }
  }
);
