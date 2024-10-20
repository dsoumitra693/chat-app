import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbRouter from './routes';

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
 * Provides a simple welcome message.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 */
app.get('/', (_, res) => {
  res.send('Welcome to Messenger-Database-Service');
});

// Database routes, handles routes defined in the dbRouter
app.use('/db', dbRouter);

/**
 * Start the Express server and listen on the specified port.
 * Logs a message to the console when the server is running.
 */
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
