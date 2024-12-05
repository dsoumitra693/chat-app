import { Conversation } from '../models';
import { produceToKafka } from '../kafka';
import { generateUUID } from '../utils/generateUUID';

/**
 * Service responsible for managing conversations between users.
 */
export class ConversationService {
  /**
   * Creates a new conversation between two users.
   *
   * @param user1 - The ID of the first user in the conversation.
   * @param user2 - The ID of the second user in the conversation.
   * @returns A promise that resolves to the created conversation object or relevant metadata.
   */
  public async create(user1: string, user2: string): Promise<any> {
    // Implementation for creating a new conversation
    const conversation = {
      id: generateUUID(),
      participants: [{ userId: user1 }, { userId: user2 }],
      conversationType: 'private',
    };
    try {
      produceToKafka('conversation.create', conversation.id, conversation);
      console.log('Conversation send to kafka successfullys');
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  /**
   * Retrieves a conversation by its unique ID.
   *
   * @param conversationId - The unique identifier of the conversation to retrieve.
   * @returns A promise that resolves to the conversation object if found, or `null` if not.
   */
  public async get(conversationId: string, userIds: string[]): Promise<any> {
    if (conversationId) {
      // If conversationId is provided, find the conversation by id
      const conversation = await Conversation.findOne({ id: conversationId });
      return conversation;
    } else if (userIds && userIds.length > 0) {
      // If no conversationId is provided, find the conversation where all userIds match
      const conversation = await Conversation.findOne({
        participants: { $all: userIds.map((userId) => ({ userId })) },
      });

      // Check if the conversation is found
      if (conversation) {
        return conversation;
      } else {
        // If no conversation is found, return a relevant message
        throw new Error('No conversation found with the provided user IDs.');
      }
    } else {
      // If neither conversationId nor userIds is provided, return an error or handle as needed
      throw new Error('Either conversationId or userIds must be provided.');
    }
  }

  public async update(
    conversationId: string,
    {
      groupDetails,
      isArchived,
      isDeleted,
    }: {
      groupDetails: {
        name: string;
        avatar: string;
        createdBy: string;
      };
      isArchived: boolean;
      isDeleted: boolean;
    }
  ): Promise<any> {
    produceToKafka('conversation.update', conversationId, {
      id: conversationId,
      groupDetails,
      isArchived,
      isDeleted,
    });
  }

  public async updateLastMessage(
    conversationId: string,
    lastMessage: {
      messageId: string;
      content: string;
      timestamp: Date;
    }
  ): Promise<any> {
    produceToKafka('lastmessage.update', conversationId, {
      id: conversationId,
      lastMessage,
    });
  }

  /**
   * Deletes a conversation by its unique ID.
   *
   * @param conversationId - The unique identifier of the conversation to delete.
   * @returns A promise that resolves when the conversation has been successfully deleted.
   */
  public async delete(conversationId: string): Promise<void> {
    // Implementation for deleting a specific conversation
    await Conversation.deleteOne({ id: conversationId });
  }
}
