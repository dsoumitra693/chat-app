import { Request, Response, NextFunction } from 'express';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import redisClient from '../../redis/redis';

/**
 * Controller to set the user's presence status in Redis.
 * @route POST /users/:userId/presence
 * @param {Request} req - The incoming request object, with `userId` as a URL parameter and `status` ("online" or "offline") in the body.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Returns a message indicating the user's status change.
 */
export const setUserPresence = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, socketId } = req.params;
    const { status } = req.body;

    if (!status || !['online', 'offline'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value.' });
      return;
    }

    const key = `presence:${userId}`;

    if (status === 'online') {
      await redisClient.set(
        key,
        JSON.stringify({
          status,
          socketId,
        }),
        'EX',
        60
      );
    } else if (status === 'offline') {
      await redisClient.del(key); // Remove user presence status
    }

    res.status(200).json({ message: `User is now ${status}.` });
  }
);

/**
 * Controller to get the user's presence status from Redis.
 * @route GET /users/:userId/presence
 * @param {Request} req - The incoming request object, with `userId` as a URL parameter.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Returns the user's current status ("online" or "offline").
 */
export const getUserPresence = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, socketId } = req.params;
    const presenceStatus = await redisClient.get(`presence:${userId}`);

    if (presenceStatus) {
      res.status(200).json({ userId, ...JSON.parse(presenceStatus) });
    } else {
      res.status(200).json({ userId, status: 'offline', socketId: null });
    }
  }
);
