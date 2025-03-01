import http from 'http';
import SocketServices from './services/SocketServices';
import express from 'express';
import { msgRouter } from './api/routes';
import { connectToDB } from './db';
import { MessageService } from './services/MessageService';
import cors from 'cors';

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
  // Middleware to parse incoming JSON requests with a body size limit of 50mb
  app.use(express.json({ limit: '50mb' }));

  // Middleware to parse URL-encoded payloads (like form submissions)
  app.use(express.urlencoded({ extended: true }));

  // Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes
  app.use(cors());
  // Create an HTTP server instance
  let httpServer = http.createServer(app);

  // Define the port to listen on, defaulting to 4000 if not specified
  const PORT = process.env.PORT || 4000;

  // Initialize the SocketServices instance
  const socketServices = new SocketServices();

  // Attach the socket.io instance to the HTTP server
  socketServices.io.attach(httpServer);

  // Set up the necessary event listeners for socket communication
  socketServices.initListeners();
  MessageService.getInstance(socketServices.io);
  app.use('/', msgRouter);

  connectToDB();

  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log('Server listening on PORT %d', PORT);
  });
};

// Call the init function to start the server
init();
