import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

// Add a new contact
export const addContact = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const contactId = req.body.contactId; // Assuming the body contains the contactId
      res.status(201).json({ message: 'Contact added successfully' });
    }
  );
  
  // Remove a contact
  export const removeContact = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const contactId = req.params.contactId;
      res.status(204).send(); // No content
    }
  );
  
  // Get user contacts
  export const getUserContacts = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      res.status(200).json();
    }
  );
  