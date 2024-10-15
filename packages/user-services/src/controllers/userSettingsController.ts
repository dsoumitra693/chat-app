import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';

// Get user settings
export const getUserSettings = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      res.status(200);
    }
  );
  
  // Update user settings
  export const updateUserSettings = asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params.id;
      res.status(200);
    }
  );
  