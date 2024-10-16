import { Router } from 'express';
import { getUserProfile,
    updateUserProfile,
    addContact,
    removeContact,
    getUserContacts,
    getUserSettings,
    updateUserSettings,
    setUserPresence,
    getUserPresence, } from '../controllers';
import { createUserProfile } from '../controllers/userProfileController';

// Initialize a new Router instance for handling authentication and user-related routes
const userRouter = Router();

/**
 * Route to create a user profile.
 * @route POST /users/:id
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.post('/users/:id', createUserProfile);

/**
 * Route to retrieve user profile data.
 * @route GET /users/:id
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/users/:id', getUserProfile);

/**
 * Route to update user profile data.
 * @route PUT /users/:id
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.put('/users/:id', updateUserProfile);

/**
 * Route to add a new contact to the user's contact list.
 * @route POST /users/:id/contacts
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.post('/users/:id/contacts', addContact);

/**
 * Route to remove a contact from the user's contact list.
 * @route DELETE /users/:id/contacts/:contactId
 * @param {string} id - The user ID.
 * @param {string} contactId - The contact ID to be removed.
 * @returns {void}
 */
userRouter.delete('/users/:id/contacts/:contactId', removeContact);

/**
 * Route to retrieve the user's contact list.
 * @route GET /users/:id/contacts
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/users/:id/contacts', getUserContacts);

/**
 * Route to update the user's presence status.
 * @route POST /users/:id/presence
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.post('/users/:id/presence', setUserPresence);

/**
 * Route to get the user's presence status.
 * @route GET /users/:id/presence
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/users/:id/presence', getUserPresence);

/**
 * Route to retrieve the user's settings.
 * @route GET /users/:id/settings
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.get('/users/:id/settings', getUserSettings);

/**
 * Route to update the user's settings.
 * @route PUT /users/:id/settings
 * @param {string} id - The user ID.
 * @returns {void}
 */
userRouter.put('/users/:id/settings', updateUserSettings);

// Export the userRouter so it can be used in the main application file
export default userRouter;
