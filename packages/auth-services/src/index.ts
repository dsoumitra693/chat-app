import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes';

// Load environment variables from a .env file into process.env
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to parse incoming JSON requests with a body size limit of 50mb
app.use(express.json({ limit: '50mb' }));

// Middleware to parse URL-encoded payloads (like form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Root route for the API, provides a simple welcome message
app.get('/', (_, res) => {
  res.send('Welcome to NextStop');
});

// Authentication routes, handles routes defined in the authRouter
app.use('/auth', authRouter);

// Start the Express server and listen on the specified port
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
