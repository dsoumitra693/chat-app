import { Request, Response, NextFunction } from 'express';
import redisClient from '../db/redis';

// Set user presence status in Redis
export const setUserPresence = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params; // Assume userId is sent as a URL parameter
  const status = req.body.status; // Expected to be "online" or "offline"

  try {
    const key = `presence:${userId}`;
    if (status === 'online') {
      await redisClient.set(key, 'online', 'EX', 60); // Set user as online for 1 hour
    } else if (status === 'offline') {
      await redisClient.del(key); // Remove user presence status
    }

    return res.status(200).json({ message: `User ${status}.` });
  } catch (error) {
    console.error('Error setting user presence:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get user presence status from Redis
export const getUserPresence = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const presenceStatus = await redisClient.get(`presence:${userId}`);

    if (presenceStatus) {
      return res.status(200).json({ userId, status: presenceStatus });
    } else {
      return res.status(200).json({ userId, status: 'offline' });
    }
  } catch (error) {
    console.error('Error getting user presence:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
