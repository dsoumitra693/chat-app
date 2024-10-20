import { Router } from 'express';
import {
  deleteAccountData,
  readAccountData,
} from '../controllers';

/**
 * Initializes a new Router instance for handling account-related database operations.
 *
 * @constant {Router} accountRouter - The router instance that defines the routes for account operations.
 */
const accountRouter = Router();

/**
 * Route to handle SQL read operations for accounts.
 * 
 * @name GET /
 * @function
 * @memberof module:accountRouter
 * @inner
 * @param {Request} req - The request object containing the query parameters for reading account data.
 * @param {Response} res - The response object for sending the retrieved data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack, in case of errors.
 */
accountRouter.get('/', readAccountData);

/**
 * Route to handle SQL delete operations for accounts.
 * 
 * @name DELETE /
 * @function
 * @memberof module:accountRouter
 * @inner
 * @param {Request} req - The request object containing the conditions for deleting account data.
 * @param {Response} res - The response object for sending the result of the delete operation back to the client.
 * @param {NextFunction} next - The next middleware function in the stack, in case of errors.
 */
accountRouter.delete('/', deleteAccountData);

// Export the accountRouter for use in the main application file
export default accountRouter;
