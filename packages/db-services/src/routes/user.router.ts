import { Router } from 'express';
import { deleteUserData, readUsersData } from '../controllers';

/**
 * Initializes a new Router instance for handling user-related database operations.
 *
 * This router defines the routes for reading and deleting user data.
 *
 * @constant {Router} userRouter - The router instance that defines the user operation routes.
 */
const userRouter = Router();

/**
 * Route to handle SQL read operations for user data.
 *
 * @name GET /
 * @function
 * @memberof module:userRouter
 * @inner
 * @param {Request} req - The request object containing the query parameters for reading user data.
 * @param {Response} res - The response object for sending the retrieved data back to the client.
 * @param {NextFunction} next - The next middleware function in the stack, in case of errors.
 */
userRouter.get('/', readUsersData);

/**
 * Route to handle SQL delete operations for user data.
 *
 * @name DELETE /
 * @function
 * @memberof module:userRouter
 * @inner
 * @param {Request} req - The request object containing the conditions for deleting user data.
 * @param {Response} res - The response object for sending the result of the delete operation back to the client.
 * @param {NextFunction} next - The next middleware function in the stack, in case of errors.
 */
userRouter.delete('/', deleteUserData);

// Export the userRouter for use in the main application file
export default userRouter;
