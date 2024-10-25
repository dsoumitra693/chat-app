import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';

export const getMessage = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {conservationId, lastMsgTimestamp} = req.body;


    res.send();
  }
);