import { Conversation } from '../models';
import { produceToKafka } from '../kafka';
import { generateUUID } from '../utils/generateUUID';
import { redisKV } from '../redis/redis';
import mongoose from 'mongoose';

/**
 * Service responsible for managing conversations between users.
 */
export class ConversationService {
  private static readonly CACHE_PREFIX = {
    CONVERSATION: 'conversation:',
    CHAT: 'chat:',
  } as const;

  private static readonly CACHE_TTL = 3600; // 1 hour in seconds

  /**
   * Creates a new conversation between two users.
   * @param user1 - The ID of the first user in the conversation.
   * @param user2 - The ID of the second user in the conversation.
   * @throws {Error} If there's an issue producing to Kafka.
   */
  public async create(
    user1: string,
    user2: string
  ): Promise<{
    id: string;
    participants: {
      userId: string;
    }[];
    conversationType: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const conversation = {
      id: generateUUID(),
      participants: [{ userId: user1 }, { userId: user2 }],
      conversationType: 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await produceToKafka(
        'conversation.create',
        conversation.id,
        conversation
      );
      this.cacheConversation(conversation);
      return conversation;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  /**
   * Retrieves a conversation by its ID or by user IDs.
   * @param params - Object containing either conversationId or userIds.
   * @returns The conversation object.
   * @throws {Error} If neither conversationId nor userIds are provided, or if the conversation is not found.
   */
  public async get(params: {
    conversationId?: string;
    userIds?: string[];
  }): Promise<any> {
    const { conversationId, userIds } = params;

    if (conversationId) {
      return this.getByConversationId(conversationId);
    } else if (userIds?.length) {
      console.log('ids: ', userIds);
      return this.getByUserIds(userIds);
    }

    throw new Error('Either conversationId or userIds must be provided.');
  }

  /**
   * Retrieves a conversation by its ID.
   * @param conversationId - The unique identifier of the conversation.
   * @returns The conversation object.
   * @throws {Error} If the conversation is not found.
   */
  private async getByConversationId(conversationId: string): Promise<any> {
    const cacheKey = `${ConversationService.CACHE_PREFIX.CONVERSATION}${conversationId}`;

    try {
      const cachedConversation = await redisKV.get(cacheKey);

      if (cachedConversation) {
        return JSON.parse(cachedConversation);
      }

      console.log({ conversationId });

      const conversation = await Conversation.findOne({ id: conversationId });
      console.log('conversation ', conversation);
      if (!conversation) {
        return null;
      }
      const parsedConversation = JSON.parse(JSON.stringify(conversation));
      delete parsedConversation._id;
      await this.cacheConversation(parsedConversation);
      return parsedConversation;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Conversation not found')
      ) {
        throw error;
      }
      console.error(`Error retrieving conversation ${conversationId}:`, error);
      return null;
    }
  }

  /**
   * Retrieves a conversation by user IDs.
   * @param userIds - Array of user IDs involved in the conversation.
   * @returns The conversation object.
   * @throws {Error} If the conversation is not found.
   */
  private async getByUserIds(userIds: string[]): Promise<any> {
    try {
      const [user1, user2] = userIds;
      const cacheKey1 = `${ConversationService.CACHE_PREFIX.CHAT}${user1}:${user2}`;
      const cacheKey2 = `${ConversationService.CACHE_PREFIX.CHAT}${user2}:${user1}`;

      const cachedConversationId =
        (await redisKV.get(cacheKey1)) || (await redisKV.get(cacheKey2));

      console.log('cache convoID ', cachedConversationId);

      if (cachedConversationId) {
        return this.getByConversationId(cachedConversationId);
      }

      // Query for the conversation
      const conversation = (
        await Conversation.aggregate([
          { $match: { 'participants.userId': { $all: userIds } } },
          { $addFields: { participantCount: { $size: '$participants' } } },
          { $match: { participantCount: userIds.length } },
        ])
      )[0];

      console.log('conversation', conversation);

      if (!conversation) {
        throw new Error(
          `No conversation found for users: ${userIds.join(', ')}`
        );
      }

      await this.cacheConversation(conversation);
      return conversation;
    } catch (error) {
      console.error(`Error retrieving conversation for users:`, error);
      return null;
    }
  }

  /**
   * Caches a conversation object.
   * @param conversation - The conversation object to cache.
   */
  private async cacheConversation(conversation: any): Promise<void> {
    try {
      const { id, participants } = conversation;
      if (!participants || participants.length < 2) {
        return;
      }

      const [user1, user2] = participants;

      let cacheOperations = [
        redisKV.setex(
          `${ConversationService.CACHE_PREFIX.CONVERSATION}${id}`,
          ConversationService.CACHE_TTL,
          JSON.stringify(conversation)
        ),
      ];
      if (participants.length === 2) {
        cacheOperations = [
          ...cacheOperations,
          redisKV.setex(
            `${ConversationService.CACHE_PREFIX.CHAT}${user1.userId}:${user2.userId}`,
            ConversationService.CACHE_TTL,
            id
          ),
          redisKV.setex(
            `${ConversationService.CACHE_PREFIX.CHAT}${user2.userId}:${user1.userId}`,
            ConversationService.CACHE_TTL,
            id
          ),
        ];
      }

      let res = await Promise.all(cacheOperations);
    } catch (error) {
      console.error('Error caching conversation:', error);
      // Don't throw here - caching failure shouldn't break the main flow
    }
  }

  /**
   * Updates a conversation.
   * @param conversationId - The ID of the conversation to update.
   * @param updateData - The data to update in the conversation.
   * @throws {Error} If there's an issue producing to Kafka.
   */
  public async update(
    conversationId: string,
    updateData: Partial<{
      groupDetails: any;
      isArchived: boolean;
      isDeleted: boolean;
    }>
  ): Promise<void> {
    try {
      await produceToKafka('conversation.update', conversationId, {
        id: conversationId,
        ...updateData,
      });
      await this.invalidateCache(conversationId);
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw new Error('Failed to update conversation');
    }
  }

  /**
   * Updates the last message of a conversation.
   * @param conversationId - The ID of the conversation to update.
   * @param lastMessage - The last message details.
   * @throws {Error} If there's an issue producing to Kafka.
   */
  public async updateLastMessage(
    conversationId: string,
    lastMessage: any
  ): Promise<void> {
    try {
      await produceToKafka('lastmessage.update', conversationId, {
        id: conversationId,
        lastMessage,
      });
      await this.invalidateCache(conversationId);
    } catch (error) {
      console.error('Error updating last message:', error);
      throw new Error('Failed to update last message');
    }
  }

  /**
   * Deletes a conversation.
   * @param conversationId - The ID of the conversation to delete.
   * @throws {Error} If there's an issue deleting the conversation.
   */
  public async delete(conversationId: string): Promise<void> {
    try {
      const result = await Conversation.deleteOne({ id: conversationId });

      if (result.deletedCount === 0) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }

      await this.invalidateCache(conversationId);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation');
    }
  }

  /**
   * Invalidates the cache for a given conversation.
   * @param conversationId - The ID of the conversation to invalidate in cache.
   */
  private async invalidateCache(conversationId: string): Promise<void> {
    try {
      const conversation = await Conversation.findOne({ id: conversationId });
      if (!conversation) {
        // Just invalidate the conversation cache if we can't find the conversation
        await redisKV.del(
          `${ConversationService.CACHE_PREFIX.CONVERSATION}${conversationId}`
        );
        return;
      }

      const { participants } = conversation;
      if (!participants || participants.length < 2) {
        await redisKV.del(
          `${ConversationService.CACHE_PREFIX.CONVERSATION}${conversationId}`
        );
        return;
      }

      const [user1, user2] = participants;

      const cacheKeys = [
        `${ConversationService.CACHE_PREFIX.CONVERSATION}${conversationId}`,
        `${ConversationService.CACHE_PREFIX.CHAT}${user1.userId}:${user2.userId}`,
        `${ConversationService.CACHE_PREFIX.CHAT}${user2.userId}:${user1.userId}`,
      ];

      await redisKV.del(...cacheKeys);
    } catch (error) {
      console.error('Error invalidating cache:', error);
      // Don't throw here - cache invalidation failure shouldn't break the main flow
    }
  }
}
