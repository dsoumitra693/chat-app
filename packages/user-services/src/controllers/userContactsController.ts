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

    if (!contactId) {
      res.status(400).json({
        success: false,
        message: 'Missing required contactId',
        errorCode: 'INVALID_INPUT',
        data: null,
      });
      return
    }

    await userService.addContact(userId, contactId);

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: { userId, contactId },
    });
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

    res.status(204).json({
      success: true,
      message: 'Contact removed successfully',
      data: null,
    });
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
    const userContacts = await userService.getContacts(userId);

    res.status(200).json({
      success: true,
      message: 'User contacts retrieved successfully',
      data: { userContacts },
    });
  }
);
