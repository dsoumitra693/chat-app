import { Router } from 'express';
import accountRouter from './account.router';
import userRouter from './user.router';

/**
 * Initializes a new Router instance for handling database-related routes.
 *
 * @constant {Router} dbRouter - The router instance that defines the database operation routes.
 */
const dbRouter = Router();


/**
 * Route to handle SQL read operations.
 * 
 * @name POST /read
 * @function
 * @memberof dbRouter
 * @inner
 * @param {Request} req - The request object containing the query parameters for reading data.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
dbRouter.use('/account', accountRouter);


/**
 * Route to handle SQL delete operations.
 * 
 * @name DELETE /delete
 * @function
 * @memberof dbRouter
 * @inner
 * @param {Request} req - The request object containing the conditions for deleting data.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
dbRouter.use('/user', userRouter);

// Export the dbRouter for use in the main application file
export default dbRouter;
