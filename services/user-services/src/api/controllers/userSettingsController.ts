import { NextFunction, Request, Response } from 'express';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { UserSettings } from '../../services/UserSettings';
import { generateUUID } from '../../utils/uuid';

// Get user settings
export const getUserSettings = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const settings = UserSettings.findOne({ userId });

    if (!settings) {
      res.status(404).json({
        success: true,
        message: 'Getting user settings failed',
        errorCode: 'SETTINGS_NOT_FOUND',
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'User settings retrieved successfully',
      data: settings,
    });
  }
);

// Update user settings
export const updateUserSettings = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, settingsId, notificationSettings, privacySettings } =
      req.body;

    const settings = new UserSettings({
      id: settingsId,
      notificationSettings: JSON.stringify(notificationSettings),
      privacySettings: JSON.stringify(privacySettings),
      userId,
    });

    if (!settings) {
      res.status(404).json({
        success: true,
        message: 'Getting user settings failed',
        errorCode: 'SETTINGS_NOT_FOUND',
        data: null,
      });
      return;
    }

    settings.update();

    res.status(200).json({
      success: true,
      message: 'User settings retrieved successfully',
      data: settings,
    });
  }
);

// Update user settings
export const createUserSettings = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, notificationSettings, privacySettings } =
      req.body;

    const settings = new UserSettings({
      id: generateUUID(),
      notificationSettings: JSON.stringify(notificationSettings),
      privacySettings: JSON.stringify(privacySettings),
      userId,
    });


    if (!settings) {
      res.status(404).json({
        success: false,
        message: 'Getting user settings failed',
        errorCode: 'SETTINGS_NOT_FOUND',
        data: null,
      });
      return;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'User settings retrieved successfully',
      data: settings,
    });
  }
);
