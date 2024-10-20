import { Router } from 'express';
import {
  deleteAccountData,
  readAccountData,
} from '../controllers';

/**
 * Initializes a new Router instance for handling database-related routes.
 *
 * @constant {Router} accountRouter - The router instance that defines the database operation routes.
 */
const accountRouter = Router();


/**
 * Route to handle SQL read operations.
 * 
 * @name POST /read
 * @function
 * @memberof accountRouter
 * @inner
 * @param {Request} req - The request object containing the query parameters for reading data.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
accountRouter.get('/', readAccountData);


/**
 * Route to handle SQL delete operations.
 * 
 * @name PUT /delete
 * @function
 * @memberof accountRouter
 * @inner
 * @param {Request} req - The request object containing the conditions for deleting data.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
accountRouter.delete('/', deleteAccountData);

// Export the accountRouter for use in the main application file
export default accountRouter;
