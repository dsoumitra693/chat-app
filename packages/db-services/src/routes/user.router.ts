import { Router } from 'express';
import { deleteUserData, readUsersData } from '../controllers';

/**
 * Initializes a new Router instance for handling database-related routes.
 *
 * @constant {Router} userRouter - The router instance that defines the database operation routes.
 */
const userRouter = Router();

/**
 * Route to handle SQL read operations.
 *
 * @name POST /read
 * @function
 * @memberof userRouter
 * @inner
 * @param {Request} req - The request object containing the query parameters for reading data.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
userRouter.get('/', readUsersData);

/**
 * Route to handle SQL delete operations.
 *
 * @name DELETE /delete
 * @function
 * @memberof userRouter
 * @inner
 * @param {Request} req - The request object containing the conditions for deleting data.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
userRouter.delete('/', deleteUserData);

// Export the userRouter for use in the main application file
export default userRouter;
