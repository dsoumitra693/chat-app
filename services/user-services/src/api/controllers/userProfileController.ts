import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import uploadImage from '../../utils/imageUpload';
import { User } from '../../services/UserService';

/**
 * @desc Retrieve user profile information by account ID
 * @route GET /users/:id/profile
 * @param {string} accountId - The account ID from the request body
 * @returns {object} user_profile - The retrieved user's profile data
 * Responds with a standardized success message on success
 */
export const getUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, userId } = req.body;

    const user_profile = await User.findOne({ phone, id: userId });

    if (!user_profile)
      return res.status(404).json({
        status: 'success',
        message: 'User profile retrieved successfully',
        data: user_profile,
      });

    // Respond with a standardized success message
    res.status(200).json({
      success: false,
      message: 'User is not exists with this phone or userId',
      errorCode: 'USER_NOT_FOUND',
      data: null,
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
    const { id, fullname, bio, phone, accountId, profilePictureBase64 } =
      req.body;
    let profilePicture: string = '';

    // Upload the updated profile picture and get its URL
    if (!!profilePictureBase64) {
      profilePicture = (await uploadImage(profilePictureBase64)) as string;
    }

    let user_profile = new User({
      id,
      fullname,
      bio,
      phone,
      accountId,
      profilePicture,
    });

    await user_profile.update();

    // Respond with a standardized success message
    res.status(200).json({
      status: 'success',
      message: 'User profile updated successfully',
      data: user_profile,
    });
  }
);

export const deleteUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, phone } = req.body;

    await User.delete({ id: userId, phone });

    // Respond with a standardized success message
    res.status(200).json({
      status: 'success',
      message: 'User profile deleted successfully',
      data: null,
    });
  }
);
