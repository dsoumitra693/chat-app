/**
 * Module exporting authentication-related controller functions.
 *
 * These functions handle user authentication tasks such as logging in, signing up,
 * password management, and token validation.
 * 
 * @module AuthControllers
 */

export { default as logIn } from './login'; // Controller function for user login
export { default as signUp } from './signup'; // Controller function for user sign-up
export { default as forgetPass } from './forgetPass'; // Controller function for handling password reset requests
export { default as changePass } from './changePass'; // Controller function for changing user password
export { default as changePhone } from './changePhone'; // Controller function for changing user phone number
export { default as validateJWT } from './validateJWT'; // Middleware for validating JSON Web Tokens (JWT)
