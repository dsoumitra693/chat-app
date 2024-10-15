import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { UserServices } from '../user';

const userService = new UserServices();

// Create a new user profile
/**
 * @desc Create a new user profile associated with an account ID
 * @route POST /users/:id/profile
 * @param {string} accountId - The account ID from the request parameters
 * @param {string} fullname - The full name of the user
 * @param {string} bio - A short bio for the user's profile
 * @returns {void}
 */
export const createUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.params.id; // Extract accountId from the request parameters
    const { fullname, bio } = req.body; // Destructure fullname and bio from request body

    // Call the UserServices to create a new user profile
    await userService.createUser({ accountId, bio, fullname });

    // Send a 201 response indicating user profile was successfully created
    res.status(201).json({ message: 'User profile created successfully' });
  }
);

// Get user profile data
/**
 * @desc Retrieve user profile information by account ID
 * @route GET /users/:id/profile
 * @param {string} accountId - The account ID from the request parameters
 * @returns {object} user_profile - The user's profile data
 */
export const getUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.params.id; // Extract accountId from the request parameters

    // Retrieve user profile by accountId
    const user_profile = await userService.getUser({ accountId });

    // Send a 200 response with the retrieved user profile
    res.status(200).json({ user: user_profile });
  }
);

// Update user profile data
/**
 * @desc Update an existing user profile associated with an account ID
 * @route PUT /users/:id/profile
 * @param {string} accountId - The account ID from the request parameters
 * @param {string} fullname - The updated full name of the user
 * @param {string} bio - The updated bio for the user's profile
 * @returns {object} user_profile - The updated user profile data
 */
export const updateUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.params.id; // Extract accountId from the request parameters
    const { fullname, bio } = req.body; // Destructure fullname and bio from request body

    // Update the user's profile using the UserServices class
    const user_profile = await userService.updateUser({
      accountId,
      bio,
      fullname,
    });

    // Send a 200 response with the updated user profile
    res.status(200).json({ user: user_profile });
  }
);
