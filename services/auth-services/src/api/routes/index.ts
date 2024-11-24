import { Router } from 'express';
import {
  changePhone,
  changePass,
  forgetPass,
  logIn,
  signUp,
  validateJWT,
} from '../controllers';

/**
 * Initializes a new Router instance for handling authentication-related routes.
 *
 * @constant {Router} authRouter - The router instance that defines the authentication routes.
 */

// Initialize a new Router instance
const authRouter = Router();

/**
 * Route to handle user login.
 * 
 * @name POST /login
 * @function
 * @memberof authRouter
 * @inner
 * @param {Request} req - The request object containing user credentials.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
authRouter.post('/login', logIn);

/**
 * Route to handle user signup/registration.
 * 
 * @name POST /signup
 * @function
 * @memberof authRouter
 * @inner
 * @param {Request} req - The request object containing user details.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
authRouter.post('/signup', signUp);

/**
 * Route to validate JWT.
 * 
 * @name POST /jwt/validate
 * @function
 * @memberof authRouter
 * @inner
 * @param {Request} req - The request object containing the JWT.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
authRouter.post('/jwt/validate', validateJWT);

/**
 * Route to handle forgotten password requests (e.g., sending a reset link).
 * 
 * @name PUT /password/forget
 * @function
 * @memberof authRouter
 * @inner
 * @param {Request} req - The request object containing the user's email or phone.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
authRouter.put('/password/forget', forgetPass);

/**
 * Route to handle changing the user's password.
 * 
 * @name PUT /change/password
 * @function
 * @memberof authRouter
 * @inner
 * @param {Request} req - The request object containing the new password.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
authRouter.put('/password/change', changePass);

/**
 * Route to handle changing the user's phone number.
 * 
 * @name PUT /phone/change
 * @function
 * @memberof authRouter
 * @inner
 * @param {Request} req - The request object containing the new phone number.
 * @param {Response} res - The response object for sending the result back to the client.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
authRouter.put('/phone/change', changePhone);

// Export the authRouter for use in the main application file
export default authRouter;
