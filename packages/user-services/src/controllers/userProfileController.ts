import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { UserServices } from '../user';
import uploadImage from '../utils/imageUpload';

const userService = new UserServices();

/**
 * @desc Create a new user profile associated with an account ID
 * @route POST /users/:id/profile
 * @param {string} accountId - The account ID from the request body
 * @param {string} fullname - The full name of the user from the request body
 * @param {string} bio - A short bio for the user's profile from the request body
 * @param {string} profilePictureBase64 - The base64-encoded profile picture from the request body
 * @returns {void} Responds with a standardized success message on success
 */
export const createUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    let profilePicture: string = '';

    // Upload the updated profile picture and get its URL
    if (!!body.profilePictureBase64) {
      profilePicture = (await uploadImage(body.profilePictureBase64)) as string;
    }
    console.log(body)
    // Create the new user profile
    await userService.createUser({ ...body, profilePicture });

    // Respond with a standardized success message
    res.status(201).json({
      status: 'success',
      message: 'User profile created successfully',
      data: null, // No data to return in this case
    });
  }
);

/**
 * @desc Retrieve user profile information by account ID
 * @route GET /users/:id/profile
 * @param {string} accountId - The account ID from the request body
 * @returns {object} user_profile - The retrieved user's profile data
 * Responds with a standardized success message on success
 */
export const getUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accountId } = req.body;

    // Retrieve the user profile using the account ID
    const user_profile = await userService.getUser({ accountId });

    // Respond with a standardized success message
    res.status(200).json({
      status: 'success',
      message: 'User profile retrieved successfully',
      data: user_profile,
    });
  }
);

/**
 * @desc Update an existing user profile associated with an account ID
 * @route PUT /users/:id/profile
 * @param {string} accountId - The account ID from the request body
 * @param {string} fullname - The updated full name of the user from the request body
 * @param {string} bio - The updated bio for the user's profile from the request body
 * @param {string} profilePictureBase64 - The updated base64-encoded profile picture from the request body
 * @returns {object} user_profile - The updated user profile data
 * Responds with a standardized success message on success
 */
export const updateUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    let profilePicture: string = '';

    // Upload the updated profile picture and get its URL
    if (!!body.profilePictureBase64) {
      profilePicture = (await uploadImage(body.profilePictureBase64)) as string;
    }

    // Update the user's profile with new data
    const user_profile = await userService.updateUser({
      ...body,
      profilePicture,
    });

    // Respond with a standardized success message
    res.status(200).json({
      status: 'success',
      message: 'User profile updated successfully',
      data: user_profile,
    });
  }
);
