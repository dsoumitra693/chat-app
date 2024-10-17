import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addContact,
  removeContact,
  getUserContacts,
  getUserSettings,
  updateUserSettings,
  setUserPresence,
  getUserPresence,
} from '../controllers';
import { createUserProfile } from '../controllers/userProfileController';
import { authenticate } from '../middleware/auth.middleware';

// Initialize a new Router instance for handling authentication and user-related routes
const userRouter = Router();

/**
 * Route to create a user profile.
 * @route POST /:id
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.post('/', authenticate, createUserProfile);

/**
 * Route to retrieve user profile data.
 * @route GET /:id
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/', authenticate, getUserProfile);

/**
 * Route to update user profile data.
 * @route PUT /:id
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.put('/', authenticate, updateUserProfile);

/**
 * Route to add a new contact to the user's contact list.
 * @route POST /:id/contacts
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.post('/contacts', authenticate, addContact);

/**
 * Route to remove a contact from the user's contact list.
 * @route DELETE /:id/contacts/:contactId
 * @param {string} id - The user ID.
 * @param {string} contactId - The contact ID to be removed.
 * @returns {void}
 */
userRouter.delete('/contacts/:contactId', authenticate, removeContact);

/**
 * Route to retrieve the user's contact list.
 * @route GET /:id/contacts
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/contacts', authenticate, getUserContacts);

/**
 * Route to update the user's presence status.
 * @route POST /:id/presence
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.post('/presence', authenticate, setUserPresence);

/**
 * Route to get the user's presence status.
 * @route GET /:id/presence
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/presence', authenticate, getUserPresence);

/**
 * Route to retrieve the user's settings.
 * @route GET /:id/settings
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/settings', authenticate, getUserSettings);

/**
 * Route to update the user's settings.
 * @route PUT /:id/settings
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.put('/settings', authenticate, updateUserSettings);

// Export the userRouter so it can be used in the main application file
export default userRouter;
