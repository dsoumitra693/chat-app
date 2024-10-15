import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';

// Get user profile data
export const getUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    res.status(200);
  }
);

// Update user profile data
export const updateUserProfile = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    res.status(200);
  }
);
