import { Router } from 'express';
import { getUserProfile,
    updateUserProfile,
    addContact,
    removeContact,
    getUserContacts,
    updateUserPresence,
    getUserPresence,
    getUserSettings,
    updateUserSettings, } from '../controllers';

// Initialize a new Router instance for handling authentication and user-related routes
const userRouter = Router();

// Route to retrieve user profile data
userRouter.get('/users/:id', getUserProfile);

// Route to update user profile data
userRouter.put('/users/:id', updateUserProfile);

// Route to add a new contact
userRouter.post('/users/:id/contacts', addContact);

// Route to remove a contact
userRouter.delete('/users/:id/contacts/:contactId', removeContact);

// Route to retrieve user contacts
userRouter.get('/users/:id/contacts', getUserContacts);

// Route to update user presence status
userRouter.post('/users/:id/presence', updateUserPresence);

// Route to get user presence status
userRouter.get('/users/:id/presence', getUserPresence);

// Route to retrieve user settings
userRouter.get('/users/:id/settings', getUserSettings);

// Route to update user settings
userRouter.put('/users/:id/settings', updateUserSettings);

// Export the userRouter so it can be used in the main application file
export default userRouter;
