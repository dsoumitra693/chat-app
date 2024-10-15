import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';
import { UserServices } from '../user';

const userService = new UserServices();

/**
 * Controller to add a new contact for the user.
 * @route POST /users/:id/contacts
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const addContact = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    const contactId = req.body.contactId; // Assuming the body contains the contactId
    await userService.addContact(userId, contactId);
    res.status(201).json({ message: 'Contact added successfully' });
  }
);

/**
 * Controller to remove a contact from the user's contact list.
 * @route DELETE /users/:id/contacts/:contactId
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const removeContact = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    const contactId = req.params.contactId;
    await userService.removeContact(userId, contactId);
    res.status(204).send(); // No content
  }
);

/**
 * Controller to retrieve the user's contact list.
 * @route GET /users/:id/contacts
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const getUserContacts = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    const user_contacts = await userService.getContacts(userId);
    res.status(200).send({ user_contacts });
  }
);
