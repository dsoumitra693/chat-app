/**
 * Exports user profile management functions from the userProfileController.
 */
export { getUserProfile, updateUserProfile } from './userProfileController';

/**
 * Exports user contact management functions from the userContactsController.
 */
export {
  addContact,
  removeContact,
  getUserContacts,
} from './userContactsController';

/**
 * Exports user presence management functions from the userPresenceController.
 */
export { getUserPresence, setUserPresence } from './userPresenceController';

/**
 * Exports user settings management functions from the userSettingsController.
 */
export { getUserSettings, updateUserSettings } from './userSettingsController';
