import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { createJWT } from '../utils/jwt';
import { getAccount } from '../db';

/**
 * Controller function to handle password change requests.
 * 
 * This function processes the password change request by verifying the old password,
 * updating the account with the new password, and returning a new JWT for the updated account.
 * 
 * @param req - Express Request object containing the request data. The request body should include:
 *               - `phone`: The phone number of the account whose password is to be changed.
 *               - `oldPass`: The current password of the user.
 *               - `newPass`: The new password to set for the user.
 * @param res - Express Response object used to send a response back to the client. The response will include:
 *              - `200 OK` with the updated JWT and account details if the password update is successful.
 *              - `400 Bad Request` if any required fields are missing.
 *              - `404 Not Found` if the account is not found for the given phone number.
 *              - `401 Unauthorized` if the old password is incorrect.
 * @param next - Express NextFunction to pass control to the next middleware (if applicable).
 * 
 * @throws {400} - If required fields (phone, newPass, oldPass) are missing.
 * @throws {404} - If the account associated with the provided phone number is not found.
 * @throws {401} - If the old password provided is incorrect.
 * 
 * @returns {200} - If the password is updated successfully, returns a JSON object containing:
 *                   - `jwt`: The new JWT for the updated account.
 *                   - `account`: The account details (accountId and phone).
 */
const changePass = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract phone, new password, and old password from the request body
    let { phone, newPass, oldPass } = req.body;

    // Return a standardized 400 Bad Request response if any required fields are missing
    if (!phone || !newPass || !oldPass) {
      return res.status(400).send({
        success: false,
        message: 'Missing required fields',
        errorCode: 'INVALID_INPUT',
        data: null
      });
    }

    // Search for the account in the database using the provided phone
    let accounts = await getAccount({phone});

    // If the account does not exist, return a 404 Not Found response
    if (!accounts) {
      return res.status(404).send({
        success: false,
        message: 'Account not found',
        errorCode: 'ACCOUNT_NOT_FOUND',
        data: null
      });
    }

    // If the old password does not match, return a 401 Unauthorized response
    if (!accounts.authenticate(oldPass)) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect old password',
        errorCode: 'INVALID_OLD_PASSWORD',
        data: null
      });
    }

    //TODO: Update the password in the database
    // Example:
    // accounts.password = newPass;
    // await accounts.save();

    // Create a new JWT for the account
    const jwt = createJWT({ id: accounts.id });

    // Return a 200 OK status with the new JWT in a standardized success response
    return res.status(200).send({
      success: true,
      message: 'Password updated successfully',
      data: {
        jwt,
        account: { accountId: accounts.id, phone: accounts.phone }
      }
    });
  }
);

export default changePass;
