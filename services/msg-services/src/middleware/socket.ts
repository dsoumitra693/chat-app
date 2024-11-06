import { ExtendedError, Socket } from 'socket.io';

/**
 * Middleware function for authenticating sockets during connection.
 *
 * @param socket - The socket instance being authenticated.
 * @param next - A callback function to signal completion of the authentication process.
 * 
 * @remarks
 * This middleware checks for the presence of `userId` and `jwt` in the socket's handshake authentication data.
 * If either is missing or invalid, it triggers the `next` callback with an error. 
 * If both are valid, it sets the `userId` on the socket instance and calls `next` without an error.
 * 
 * This is typically used in the Socket.IO connection process to ensure only authenticated users can connect.
 */
export const socketAuth = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const { userId, jwt } = socket.handshake.auth;
  if (!userId || !jwt) {
    return next(new Error('Invalid userId or jwt token'));
  }
  socket.userId = userId; // Set userId on the socket
  next();
};
