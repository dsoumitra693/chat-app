import { Server } from 'socket.io';
import { sub, redisKV, pub } from '../redis/redis';
import { produceToKafka } from '../kafka';
import { Message } from '../models';
import { KVStore } from './KVStore';

const kvStore = KVStore.getInstance();

/**
 * Service responsible for managing messages. It handles sending messages
 * via Redis pub/sub channels for real-time delivery with Socket.IO and publishing to Kafka.
 */
export class MessageService {
  private _socket: Server | undefined;

  // Static instance for singleton pattern
  private static instance: MessageService;

  /**
   * Private constructor to initialize the MessageService with a Socket.IO server instance.
   * It subscribes to Redis channels and listens for events to emit messages to clients.
   *
   * @param socket - The Socket.IO server instance used for broadcasting messages.
   */
  private constructor(socket?: Server) {
    this._socket = socket;

    // Subscribe to Redis channels for new messages and reactions.
    sub.subscribe('MESSAGE'); // Channel for new messages.
    sub.subscribe('REACTION'); // Channel for message reactions.

    // Listen for messages on subscribed Redis channels.
    sub.on('message', async (channel: string, message: string) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error) {
        console.error('Failed to parse message from Redis:', error);
        return; // Exit if JSON parsing fails.
      }

      // Retrieve the Socket.IO client ID for the recipient.
      const socketIds = parsedMessage.recipientIds.map((reciver: string) =>
        kvStore.get(reciver)
      );

      // If the recipient is online, emit the message event to that specific socket.
      if (this._socket && socketIds) {
        socketIds.foreach((socketId: string) =>
          this._socket
            ?.to(socketId)
            .emit(`event:${channel.toLowerCase()}`, parsedMessage)
        );
      }
    });
  }

  /**
   * Returns the singleton instance of MessageService. The first call must include a valid Socket.IO instance.
   *
   * @param socket - Optional Socket.IO server instance used for initialization.
   * @returns The singleton instance of MessageService.
   *
   * @throws Error if the instance is not yet created and no socket instance is provided.
   */
  static getInstance(socket?: Server): MessageService {
    if (MessageService.instance) {
      return MessageService.instance;
    }

    MessageService.instance = new MessageService(socket);
    return MessageService.instance;
  }

  /**
   * Publishes a message to a specified Redis channel ('MESSAGE' or 'REACTION') and sends it to Kafka.
   *
   * @param message - The message object to publish.
   * @param channel - The target Redis channel ('MESSAGE' or 'REACTION').
   * @returns A promise that resolves when the message is published.
   */
  public async send(
    message: any,
    channel: 'MESSAGE' | 'REACTION'
  ): Promise<void> {
    // Publish the message to the specified Redis channel.
    await pub.publish(channel, JSON.stringify(message));

    // Produce the message data to Kafka for further processing.
    produceToKafka('message.create', message.id, message);
  }

  /**
   * Retrieves historical messages for a given conversation that were created before a specified timestamp.
   *
   * @param conversationId - The conversation's identifier.
   * @param lastMsgTimestamp - The ISO string representation of the timestamp of the last retrieved message.
   * @returns A promise that resolves to an array of message objects.
   */
  static async get(
    conversationId: string,
    lastMsgTimestamp: string
  ): Promise<any[]> {
    // If lastMsgTimestamp is not provided, default to the earliest possible date.
    const messages = await Message.find({
      conversationId,
      createdAt: { $lt: new Date(lastMsgTimestamp || 0) },
    })
      .sort({ createdAt: -1 })
      .exec();

    // Return an empty array if no messages are found.
    return messages.length ? messages : [];
  }
}
