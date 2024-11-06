import { Router } from 'express';
import accountRouter from './account.router';
import userRouter from './user.router';

/**
 * Initializes a new Router instance for handling database-related routes.
 *
 * This router consolidates routes for account and user operations, delegating
 * to their respective sub-routers.
 *
 * @constant {Router} dbRouter - The router instance that defines the database operation routes.
 */
const dbRouter = Router();

/**
 * Mounts the accountRouter to handle routes under `/account`.
 * 
 * This handles SQL operations like reading and deleting account-related data.
 * 
 * @name /account
 * @function
 * @memberof module:dbRouter
 * @inner
 * @param {Request} req - The request object for account operations.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
dbRouter.use('/account', accountRouter);

/**
 * Mounts the userRouter to handle routes under `/user`.
 * 
 * This handles SQL operations like reading and deleting user-related data.
 * 
 * @name /user
 * @function
 * @memberof module:dbRouter
 * @inner
 * @param {Request} req - The request object for user operations.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
dbRouter.use('/user', userRouter);

// Export the dbRouter for use in the main application file
export default dbRouter;
