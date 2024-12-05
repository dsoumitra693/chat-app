import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    recipientIds: {
      type: [String],
      required: true, // List of recipients for group or single chat
    },
    content: {
      text: { type: String }, // Text content
      media: {
        type: [
          {
            type: String, // File type (e.g., "image", "video", "audio", "file")
            url: { type: String, required: true }, // Media URL (stored in S3 or similar)
            size: { type: Number }, // File size in bytes
            metadata: { type: mongoose.Schema.Types.Mixed }, // Optional metadata (e.g., duration for audio/video)
          },
        ],
        default: [],
      },
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent',
    },
    reactions: {
      type: [
        {
          userId: { type: String }, // User reacting
          reactionType: { type: String }, // Reaction emoji or type
        },
      ],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false, // Indicates whether the message is deleted
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Message = mongoose.model('Message', messageSchema);
