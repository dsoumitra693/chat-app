import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';

/**
 * Controller function to handle forgotten password requests.
 * 
 * @param req - Express Request object containing the request data
 * @param res - Express Response object used to send a response back to the client
 * @param next - Express NextFunction to pass control to the next middleware
 * 
 * This function should handle the flow of resetting a user's password, such as sending a password reset link or code.
 * 
 * @TODO Validate the provided phone number in the request body.
 * @TODO Implement logic for generating and sending a password reset token/link.
 * @TODO Handle database updates for storing the reset token and updating the password.
 * @TODO Implement rate-limiting or other security measures to prevent abuse of the forget password feature.
 */
export const forgetPass = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Extract phone number from the request body
    // TODO: Validate that the phone number exists in the database
    // TODO: Generate a password reset token or link
    // TODO: Send the password reset link/token to the user (via SMS)
    // TODO: Implement error handling for any potential issues in the flow
    // TODO: Respond to the client confirming the reset link/token was sent successfully
  }
);

export default forgetPass;
