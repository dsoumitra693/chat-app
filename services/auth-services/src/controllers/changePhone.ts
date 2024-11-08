import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { getAccount } from '../db';

/**
 * Controller function to handle phone number change requests.
 * 
 * This function verifies if the provided password matches the existing account with the old phone number
 * and updates the account with a new phone number if successful.
 *
 * @param req - Express Request object containing the request data. The request body should include:
 *               - `previousPhone`: The current phone number of the user.
 *               - `newPhone`: The new phone number to set for the user.
 *               - `password`: The current password for the user.
 * @param res - Express Response object used to send a response back to the client. The response will include:
 *              - `200 OK` with a success message if the phone number is updated successfully.
 *              - `400 Bad Request` if any required fields are missing.
 *              - `404 Not Found` if the account with the provided previous phone number is not found.
 *              - `401 Unauthorized` if the provided password is incorrect.
 *              - `409 Conflict` if the new phone number is already associated with another account.
 * @param next - Express NextFunction to pass control to the next middleware (if applicable).
 * 
 * @throws {400} - If required fields (`previousPhone`, `newPhone`, `password`) are missing.
 * @throws {404} - If the account associated with the provided `previousPhone` is not found.
 * @throws {401} - If the provided `password` is incorrect.
 * @throws {409} - If the `newPhone` is already associated with another account.
 * 
 * @returns {200} - If the phone number is updated successfully, returns a JSON object containing:
 *                   - `accountId`: The ID of the account.
 *                   - `newPhone`: The newly updated phone number.
 */
const changePhone = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract the previous phone, new phone, and password from the request body
    let { previousPhone, newPhone, password } = req.body;

    // Return a standardized 400 Bad Request response if any required fields are missing
    if (!previousPhone || !newPhone || !password) {
      return res.status(400).send({
        success: false,
        message: 'Missing required fields',
        errorCode: 'INVALID_INPUT',
        data: null,
      });
    }

    // Search for the account with the previous phone number
    const accounts = await getAccount({ phone: previousPhone });

    // If the account does not exist, return a 404 Not Found response
    if (!accounts) {
      return res.status(404).send({
        success: false,
        message: 'Account not found',
        errorCode: 'ACCOUNT_NOT_FOUND',
        data: null,
      });
    }

    // If the password does not match, return a 401 Unauthorized response
    if (!accounts.authenticate(password)) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect old password',
        errorCode: 'INVALID_PASSWORD',
        data: null,
      });
    }

    // Check if the new phone number is already associated with another account
    let existingAccountWithNewPhone = await getAccount({ phone: newPhone });

    // If an account with the new phone number already exists, return a 409 Conflict response
    if (existingAccountWithNewPhone) {
      return res.status(409).send({
        success: false,
        message: 'New phone number already in use',
        errorCode: 'PHONE_CONFLICT',
        data: null,
      });
    }

    //TODO: Update the phone number in the database
    // Example:
    // accounts.phone = newPhone;
    // await accounts.save();

    // Return a 200 OK status with a success message
    return res.status(200).send({
      success: true,
      message: 'Phone number updated successfully',
      data: { accountId: accounts.id, newPhone },
    });
  }
);

export default changePhone;
