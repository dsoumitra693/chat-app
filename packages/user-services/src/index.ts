import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes';
import { initConsumer } from './kafka';

// Load environment variables from a .env file into process.env
dotenv.config();

const PORT = process.env.PORT || 3000; // Define the port for the server
const app = express();

// Middleware to parse incoming JSON requests with a body size limit of 50mb
app.use(express.json({ limit: '50mb' }));

// Middleware to parse URL-encoded payloads (like form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

/**
 * Root route for the API.
 *
 * @returns A welcome message to the client.
 */
app.get('/', (_, res) => {
  res.send('Welcome to Messenger-User-Service');
});

// Authentication routes, handles routes defined in the userRouter
app.use('/users', userRouter);

initConsumer();

/**
 * Starts the Express server and listens on the specified port.
 *
 * @param PORT - The port number the server listens on.
 */
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
