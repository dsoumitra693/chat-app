import { NextFunction, Request, Response } from 'express';
import { ConversationService } from '../../services/conversationService';
import { asyncErrorHandler } from '../../utils/asyncErrorHandler';
import { MessageService } from '../../services/MessageService';


const conversationService = new ConversationService();

/**
 * Retrieves messages for a specific conversation after a given timestamp.
 * 
 * @param req - Express request object, containing `conversationId` and `lastMsgTimestamp` in the body.
 * @param res - Express response object used to send back message data.
 * @param next - Next function to handle errors in middleware.
 * 
 * @returns A JSON response with a success message and retrieved messages.
 */
export const getMessage = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId, lastMsgTimestamp } = req.query;
    const messages = await MessageService.get(conversationId as string, lastMsgTimestamp as string);

    res.status(200).json({
      success: true,
      message: 'Message retrieval successful',
      data: { messages },
    });
  }
);

/**
 * Retrieves details of a specific conversation.
 * 
 * @param req - Express request object, containing `conversationId` in the body.
 * @param res - Express response object used to send back conversation data.
 * @param next - Next function to handle errors in middleware.
 * 
 * @returns A JSON response with a success message and retrieved conversation data.
 */
export const getConversation = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.body;
    const conversation = await conversationService.get(conversationId);

    res.status(200).json({
      success: true,
      message: 'Conversation retrieval successful',
      data: { conversation },
    });
  }
);

/**
 * Deletes a specific conversation by its ID.
 * 
 * @param req - Express request object, containing `conversationId` in the body.
 * @param res - Express response object used to confirm deletion.
 * @param next - Next function to handle errors in middleware.
 * 
 * @returns A JSON response confirming the conversation was deleted.
 */
export const deleteConversation = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.body;
    await conversationService.delete(conversationId);

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
      data: null,
    });
  }
);
