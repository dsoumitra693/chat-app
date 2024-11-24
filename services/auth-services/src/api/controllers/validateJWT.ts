import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { verifyJWT } from '../../utils/jwt';
import { Account } from '../../services/account';
import { jwtStore } from '../../redis/jwt-store';

/**
 * Middleware function to validate a JSON Web Token (JWT) and retrieve account information.
 *
 * This middleware function extracts the JWT from the request, verifies it, and checks if the corresponding
 * account exists in the database. If the JWT is valid and the account exists, it sends the account ID
 * back in the response. If the JWT is invalid or the account does not exist, it returns an appropriate error.
 *
 * @async
 * @function validateJWT
 * @param {Request} req - The Express request object containing the JWT to validate.
 * @param {Response} res - The Express response object used to send back the desired HTTP response.
 * @param {NextFunction} next - The Express next middleware function to pass control to the next middleware if needed.
 * @returns {Promise<void>} - Sends the account ID if the JWT is valid and the account exists,
 *                            or an error message with the appropriate status code if unsuccessful.
 *
 * @throws {400} - If the token is missing or invalid.
 * @throws {404} - If the account corresponding to the token does not exist.
 *
 * This function is wrapped in `asyncErrorHandler` to catch and handle any asynchronous errors gracefully.
 */
const validateJWT = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from the request body
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    // Return a standardized 400 Bad Request response if token is missing
    if (!token) {
      return res.status(400).send({
        success: false,
        message: 'Token is required.',
        errorCode: 'MISSING_TOKEN',
        data: null,
      });
    }

    const data = await jwtStore.read(token);
    const accountData = JSON.parse(data!);

    // Send back the account ID if validation is successful
    return res.status(200).send({
      success: true,
      message: 'JWT validation successful.',
      data:accountData,
    });
  }
);

export default validateJWT;
