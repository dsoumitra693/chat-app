import http from 'http';
import SocketServices from './services/SocketServices';
import express from 'express';
import { msgRouter } from './routes';

/**
 * Initializes the HTTP server and socket services, and starts listening on the specified port.
 *
 * This asynchronous function creates an HTTP server, initializes socket services for real-time communication,
 * and listens on the specified port (defaults to 4000 if not provided via the environment).
 *
 * @async
 * @function init
 * @returns {Promise<void>} - A promise that resolves once the server has started.
 */
const init = async (): Promise<void> => {
  const app = express();
  // Create an HTTP server instance
  let httpServer = http.createServer(app);

  app.use('/', msgRouter);

  // Define the port to listen on, defaulting to 4000 if not specified
  const PORT = process.env.PORT || 4000;

  // Initialize the SocketServices instance
  const socketServices = new SocketServices();

  // Attach the socket.io instance to the HTTP server
  socketServices.io.attach(httpServer);

  // Set up the necessary event listeners for socket communication
  socketServices.initListeners();

  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log('Server listening on PORT %d', PORT);
  });
};

// Call the init function to start the server
init();
