import mongoose, { Document, Schema } from 'mongoose';

// Participant Schema
export const Participant = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isAdmin: { type: Boolean, default: false },
});

// GroupDetails Schema
export const GroupDetails = new Schema({
  name: { type: String, required: true, trim: true },
  avatar: { type: String, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// LastMessage Schema
export const LastMessage = new Schema({
  messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
  content: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Conversation Schema
const ConversationSchema = new Schema(
  {
    participants: {
      type: [Participant],
      validate: [
        arrayMinLength(2),
        'Conversation must have at least 2 participants',
      ],
    },
    conversationType: {
      type: String,
      enum: ['private', 'group'],
      required: true,
    },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    lastMessage: { type: LastMessage, default: null },
    groupDetails: { type: GroupDetails, default: null },
  },
  { timestamps: true }
);

// Custom validator function
function arrayMinLength(minLength: number) {
  return function (value: any[]) {
    return value.length >= minLength;
  };
}

// Conversation Interface
export interface IConversation extends Document {
  participants: Array<{ userId: mongoose.Types.ObjectId; isAdmin: boolean }>;
  conversationType: 'private' | 'group';
  isArchived: boolean;
  isDeleted: boolean;
  lastMessage?: {
    messageId: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    senderId: mongoose.Types.ObjectId;
  };
  groupDetails?: {
    name: string;
    avatar?: string;
    createdBy: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Conversation Model
export const Conversation = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);

// Export Message model (assuming it's defined in message.models.ts)
export { Message } from './message.models';
