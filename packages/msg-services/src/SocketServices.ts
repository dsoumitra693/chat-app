import { Server, Socket } from 'socket.io';
import { sub, pub, redisKV } from './redis';

// Extend the Socket interface to include userId
declare module 'socket.io' {
  interface Socket {
    userId: string; // Add userId to the Socket type
  }
}

/**
 * The `SocketServices` class manages the setup and configuration of the Socket.IO server
 * and handles socket events such as connections, messages, and disconnections.
 */
class SocketServices {
  private _io: Server;

  /**
   * Constructs a new `SocketServices` instance and initializes the Socket.IO server.
   * 
   * - Configures CORS options to allow cross-origin requests.
   * - Sets up middleware to validate `userId` and JWT tokens on socket connections.
   * - Subscribes to Redis channels to handle incoming messages and emit events to connected clients.
   */
  constructor() {
    // Initialize a new instance of Socket.IO with CORS options
    this._io = new Server({
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true, // Allow cookies or auth headers to be sent with requests
      },
    });

    // Middleware to validate userId and jwt on socket connection
    this._io.use((socket: Socket, next) => {
      const { userId, jwt } = socket.handshake.auth;
      if (!userId || !jwt) {
        return next(new Error('Invalid userId or jwt token'));
      }
      socket.userId = userId; // Set userId on the socket
      next();
    });

    // Subscribe to Redis messages once
    sub.subscribe('MESSAGE');
    sub.on('message', async (channel, message) => {
      if (channel === 'MESSAGE') {
        const parsedMessage = JSON.parse(message);
        const socketId = await redisKV.get(parsedMessage.to.userId);

        // Emit the message event to the recipient if they're online
        if (socketId) {
          this._io.to(socketId).emit('event:message', parsedMessage);
        }
      }
    });
  }

  /**
   * Provides access to the Socket.IO server instance.
   * 
   * @returns {Server} The Socket.IO server instance.
   */
  get io(): Server {
    return this._io;
  }

  /**
   * Initializes event listeners for socket connections.
   * 
   * - Sets up listeners for the `connection` event to log when a new socket connects.
   * - Listens for `event:message` events from the client to handle incoming messages.
   * - Handles socket disconnections and removes the user from Redis when they disconnect.
   */
  public initListeners(): void {
    let io = this._io;

    io.on('connection', async (socket: Socket) => {
      await redisKV.set(socket.userId, socket.id); // Store socket ID with userId

      // Listen for messages sent from the client
      socket.on('event:message', async (message) => {
        await pub.publish('MESSAGE', JSON.stringify(message)); // Publish message to Redis
      });

      // Handle socket disconnection
      socket.on('disconnect', async () => {
        await redisKV.del(socket.userId); // Remove the userId from Redis when disconnected
      });
    });
  }
}

export default SocketServices;
