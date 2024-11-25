import { NextFunction, Request, Response } from 'express';
import { UserContact } from '../../services/UserContactService';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { User } from '../../services/UserService';
import { generateUUID } from '../../utils/uuid';

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
    const { userId, contactPhone } = req.body;

    if (!contactPhone) {
      res.status(400).json({
        success: false,
        message: 'Missing required contactId',
        errorCode: 'INVALID_INPUT',
        data: null,
      });
      return;
    }

    const contact_user = await User.findOne({ phone: contactPhone });

    if (!contact_user) {
      res.status(404).json({
        success: true,
        message: 'No user is found with this phone',
        errorCode: 'USER_NOT_FOUND',
        data: null,
      });
      return;
    }
    const contact = new UserContact({
      contactUserId: contact_user.id,
      userId,
      id: generateUUID(),
    });

    if (!contact) {
      res.status(500).json({
        success: false,
        message: 'Error while creating contact',
        errorCode: 'CONTACT_NOT_CREATED',
        data: null,
      });
      return;
    }

    contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: contact,
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
    const contactId = req.params.contactId;

    await UserContact.delete({ id: contactId });

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
    const contacts = await UserContact.find({ userId });

    if (!contacts?.length) {
      res.status(404).json({
        success: false,
        message: 'Retriving user contacts failed',
        errorCode: 'CONTACT_NOT_FOUND',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User contacts retrieved successfully',
      data: { contacts },
    });
  }
);
