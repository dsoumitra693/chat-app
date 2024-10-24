import { Server, Socket } from 'socket.io';
import { sub, pub, redisKV } from './redis';
import { socketAuth } from '../middleware/socket';
import { FileUploader } from './fileUploader';

// Extend the Socket interface to include userId
declare module 'socket.io' {
  interface Socket {
    userId: string; // Add userId to the Socket type for easy access
  }
}

const MAX_BUFFER_SIZE = 2e20 * 2; // Maximum buffer size for HTTP requests

/**
 * The `SocketServices` class manages the setup and configuration of the Socket.IO server
 * and handles socket events such as connections, messages, and disconnections.
 */
class SocketServices {
  private _io: Server; // Instance of the Socket.IO server

  /**
   * Constructs a new `SocketServices` instance and initializes the Socket.IO server.
   *
   * - Configures CORS options to allow cross-origin requests from any origin.
   * - Sets up middleware to validate `userId` and JWT tokens on socket connections.
   * - Subscribes to Redis channels to handle incoming messages and emit events to connected clients.
   */
  constructor() {
    // Initialize a new instance of Socket.IO with CORS options
    this._io = new Server({
      cors: {
        origin: '*', // Allow requests from any origin
        methods: ['GET', 'POST'], // Allowed HTTP methods
        credentials: true, // Allow cookies or auth headers to be sent with requests
      },
      maxHttpBufferSize: MAX_BUFFER_SIZE, // Set the maximum buffer size for HTTP requests
    });

    // Middleware to validate userId and JWT on socket connection
    this._io.use(socketAuth);

    // Subscribe to Redis messages for handling different channels
    sub.subscribe('MESSAGE'); // Subscribe to MESSAGE channel for incoming messages
    sub.subscribe('REACTION'); // Subscribe to REACTION channel for incoming reactions

    // Handle incoming messages from Redis
    sub.on('message', async (channel, message) => {
      if (channel === 'MESSAGE') {
        const parsedMessage = JSON.parse(message); // Parse the incoming message from Redis
        const socketId = await redisKV.get(parsedMessage.to.userId); // Retrieve the socket ID associated with the user

        // Emit the message event to the recipient if they're online
        if (socketId) {
          this._io.to(socketId).emit('event:message', parsedMessage); // Emit the message to the specific socket ID
        }
      }

      if (channel === 'REACTION') {
        const parsedReaction = JSON.parse(message); // Parse the incoming reaction from Redis
        const socketId = await redisKV.get(parsedReaction.to.userId); // Retrieve the socket ID associated with the user

        // Emit the reaction event to the recipient if they're online
        if (socketId) {
          this._io.to(socketId).emit('event:reaction', parsedReaction); // Emit the reaction to the specific socket ID
        }
      }
    });
  }

  /**
   * Provides access to the Socket.IO server instance.
   *
   * @returns {Server} The Socket.IO server instance for handling socket connections.
   */
  get io(): Server {
    return this._io; // Return the Socket.IO server instance
  }

  /**
   * Initializes event listeners for socket connections.
   *
   * - Sets up listeners for the `connection` event to log when a new socket connects.
   * - Listens for `event:message` events from the client to handle incoming messages.
   * - Listens for `event:reaction` events from the client to handle reactions.
   * - Handles socket disconnections and removes the user from Redis when they disconnect.
   */
  public initListeners(): void {
    let io = this._io; // Get the Socket.IO server instance
    const fileUploader = new FileUploader(); // Create an instance of FileUploader to handle file uploads

    io.on('connection', async (socket: Socket) => {
      // Store the user's socket ID in Redis with the associated userId
      await redisKV.set(socket.userId, socket.id); // Store socket ID with userId

      // Listen for messages sent from the client
      socket.on('event:message', async (message) => {
        if (message.fileType !== 'NONE') { // Check if there is a file to upload
          const { file } = message; // Extract the file from the message
          let filename = await fileUploader.upload(file); // Upload the file and get the filename
          message.file = filename; // Attach the uploaded filename to the message
        }
        // Publish the message to Redis for other subscribers
        await pub.publish('MESSAGE', JSON.stringify(message)); // Publish message to Redis
      });

      // Listen for reactions sent from the client
      socket.on('event:reaction', async (reaction) => {
        // Publish the reaction to Redis for other subscribers
        await pub.publish('REACTION', JSON.stringify(reaction)); // Publish reaction to Redis
      });

      // Handle socket disconnection
      socket.on('disconnect', async () => {
        // Remove the userId from Redis when the socket disconnects
        await redisKV.del(socket.userId); // Remove the userId from Redis when disconnected
      });
    });
  }
}

export default SocketServices; // Export the SocketServices class for use in other modules
