import { Server } from 'socket.io';
import { pub, redisKV, sub } from './redis';

interface ParsedMessage {
  to: {
    userId: string;
  };
  [key: string]: any; // Additional properties that the message may contain
}

/**
 * Service responsible for managing messages, including sending messages
 * via Redis pub/sub channels and handling real-time message delivery through Socket.IO.
 */
export class MessageService {
  private _socket: Server;

  /**
   * Initializes the MessageService with a Socket.IO server instance and sets up
   * Redis subscriptions for `MESSAGE` and `REACTION` channels.
   *
   * @param socket - The Socket.IO server instance to use for message broadcasting.
   */
  constructor(socket: Server) {
    this._socket = socket;

    // Subscribe to Redis channels for messages and reactions
    sub.subscribe('MESSAGE'); // MESSAGE channel for new messages
    sub.subscribe('REACTION'); // REACTION channel for message reactions

    // Listen for messages on subscribed Redis channels
    sub.on('message', async (channel:string, message:string) => {
      const parsedMessage: ParsedMessage = JSON.parse(message);
      const socketId = await redisKV.get(parsedMessage.to.userId); // Get recipient's socket ID

      // Emit the message event to the recipient if they are online
      if (socketId) {
        this._socket
          .to(socketId)
          .emit(`event:${channel.toLowerCase()}`, parsedMessage);
      }
    });
  }

  /**
   * Publishes a message to a specified Redis channel (`MESSAGE` or `REACTION`).
   *
   * @param message - The message to be sent.
   * @param channel - The Redis channel to publish the message to ('MESSAGE' or 'REACTION').
   */
  public async send(message: ParsedMessage, channel: 'MESSAGE' | 'REACTION'): Promise<void> {
    await pub.publish(channel, JSON.stringify(message));
  }

  /**
   * Retrieves messages from the database based on a conversation ID and timestamp.
   *
   * @param conversationId - The ID of the conversation for which messages are retrieved.
   * @param lastMsgTimestamp - The timestamp of the last retrieved message.
   * @returns A promise that resolves to an array of messages after the specified timestamp.
   */
  static async get(conversationId: string, lastMsgTimestamp: string): Promise<any[]> {
    // Implementation for retrieving messages, likely from a database
    // TODO: Replace `any[]` with the actual type of the message objects
    return []; // Placeholder implementation
  }
}
