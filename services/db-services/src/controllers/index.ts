/**
 * Module exporting authentication-related controller functions.
 *
 * These functions handle tasks related to accounts and users, including:
 * - Account: Reading and deleting account data.
 * - User: Reading and deleting user data.
 *
 * The functions are responsible for performing database operations and
 * returning appropriate responses to client requests.
 *
 * @module dbControllers
 */

export { deleteAccountData, readAccountData } from './account.controller';
export { deleteUserData, readUsersData } from './user.controller';
