import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

// Update user presence status
export const updateUserPresence = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      const status = req.body.status; // Expecting body to have a status field
      res.status(200).json({ message: 'Presence updated successfully' });
    }
  );
  
  // Get user presence status
  export const getUserPresence = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      res.status(200).json();
    }
  );
  