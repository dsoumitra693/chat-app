import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    participants: {
      type: [
        {
          userId: { type: String, required: true }, // User ID of a participant
          isAdmin: { type: Boolean, default: false }, // Optional for group conversations
        },
      ],
      required: true,
      validate: (value: string | any[]) => value.length > 1, // At least two participants required
    },
    conversationType: {
      type: String,
      enum: ['private', 'group'], // Type of conversation: 'private' (1-1) or 'group'
      required: true,
    },
    lastMessage: {
      messageId: { type: String }, // Reference to the last message in the conversation
      content: { type: String }, // A preview of the last message
      timestamp: { type: Date }, // When the last message was sent
    },
    groupDetails: {
      name: { type: String }, // Group name (only for group chats)
      avatar: { type: String }, // Group avatar (URL to an image)
      createdBy: { type: String }, // User ID of the creator
    },
    isArchived: {
      type: Boolean,
      default: false, // Indicates if the conversation is archived
    },
    isDeleted: {
      type: Boolean,
      default: false, // Indicates if the conversation is deleted (soft delete)
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);