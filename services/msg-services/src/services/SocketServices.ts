import { Server, Socket } from 'socket.io';
import { FileUploader } from './fileUploader';
import { ConversationService } from './conversationService';
import { MessageService } from './MessageService';
import { socketAuth } from '../api/middleware/socket';
import { redisKV } from '../redis/redis';
import { KVStore } from './KVStore';

// Extend the Socket interface to include userId
declare module 'socket.io' {
  interface Socket {
    userId: string;
  }
}

const MAX_BUFFER_SIZE = 2e20 * 7; // Maximum buffer size for HTTP requests
const kvStore = KVStore.getInstance();

/**
 * The `SocketServices` class manages the setup and configuration of the Socket.IO server
 * and handles socket events such as connections, messages, reactions, and file uploads.
 */
class SocketServices {
  private _io: Server;

  /**
   * Constructs a new `SocketServices` instance and initializes the Socket.IO server with
   * CORS options, middleware for authentication, and Redis subscriptions for real-time communication.
   */
  constructor() {
    this._io = new Server({
      cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'], // Allowed HTTP methods
        credentials: true, // Allow cookies and authentication headers
      },
      maxHttpBufferSize: MAX_BUFFER_SIZE, // Set the max buffer size
    });

    // Middleware for socket authentication
    this._io.use(socketAuth);
  }

  /**
   * Provides access to the Socket.IO server instance.
   *
   * @returns The Socket.IO server instance.
   */
  get io(): Server {
    return this._io;
  }

  /**
   * Initializes event listeners for socket connections, handling various socket events.
   *
   * - `event:message`: Handles incoming messages.
   * - `event:reaction`: Handles message reactions.
   * - `event:initiate-upload`, `event:part-upload`, `event:complete-upload`: Handle file uploads in parts.
   * - `event:conversation`: Initializes a new conversation.
   * - `disconnect`: Cleans up Redis entries on disconnection.
   */
  public initListeners(): void {
    const io = this._io;
    const fileUploader = new FileUploader();
    const conversationService = new ConversationService();
    const messageService = MessageService.getInstance(io);

    io.on('connection', async (socket: Socket) => {
      kvStore.set(socket.userId, socket.id); // Store socket ID by userId in Redis

      socket.on(
        'event:initiate-upload',
        async ({ filename, filetype }, callback) => {
          const uploadId = await fileUploader.initiateMultipartUpload(
            filename,
            filetype
          );
          callback({ status: 'success', uploadId });
        }
      );

      socket.on(
        'event:part-upload',
        async ({ key, uploadId, partNumber, chunk }, callback) => {
          const uploadPart = await fileUploader.uploadPart(
            key,
            uploadId,
            partNumber,
            chunk
          );
          callback({ status: 'success', uploadPart });
        }
      );

      socket.on(
        'event:complete-upload',
        async ({ key, uploadId, parts }, callback) => {
          const url = await fileUploader.completeMultipartUpload(
            key,
            uploadId,
            parts
          );
          callback({ status: 'success', url });
        }
      );

      socket.on('event:conversation', async ({ userId_1, userId_2 }) => {
        await conversationService.create(userId_1, userId_2); // Start a new conversation
      });

      socket.on('disconnect', async () => {
        kvStore.del(socket.userId); // Remove userId from Redis on disconnect
      });
    });
  }
}

export default SocketServices;
