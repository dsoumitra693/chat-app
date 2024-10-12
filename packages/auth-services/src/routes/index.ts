import { Router } from 'express';
import {
  changePhone,
  changePass,
  forgetPass,
  logIn,
  signUp,
  validateJWT,
} from '../controllers';

// Initialize a new Router instance for handling authentication-related routes
const authRouter = Router();

// Route to handle user login
authRouter.post('/login', logIn);

// Route to handle user signup/registration
authRouter.post('/signup', signUp);

// Route to validate JWT
authRouter.post('/jwt/validate', validateJWT);

// Route to handle forgotten password requests (e.g., sending a reset link)
authRouter.put('/password/forget', forgetPass);

// Route to handle changing the user's password
authRouter.put('/change/phone', changePass);

// Route to handle changing the user's email address
authRouter.put('/change/phone', changePhone);

// Export the authRouter so it can be used in the main application file
export default authRouter;
