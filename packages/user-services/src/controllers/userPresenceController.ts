import { Request, Response, NextFunction } from 'express';
import redisClient from '../db/redis';
import { asyncErrorHandler } from '../utils/asyncErrorHandler';

// Set user presence status in Redis
export const setUserPresence = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params; // Assume userId is sent as a URL parameter
    const status = req.body.status; // Expected to be "online" or "offline"

    const key = `presence:${userId}`;
    if (status === 'online') {
      await redisClient.set(key, 'online', 'EX', 60); // Set user as online for 1 hour
    } else if (status === 'offline') {
      await redisClient.del(key); // Remove user presence status
    }

    return res.status(200).json({ message: `User ${status}.` });
  }
);

// Get user presence status from Redis
export const getUserPresence = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const presenceStatus = await redisClient.get(`presence:${userId}`);

    if (presenceStatus) {
      return res.status(200).json({ userId, status: presenceStatus });
    } else {
      return res.status(200).json({ userId, status: 'offline' });
    }
  }
);
