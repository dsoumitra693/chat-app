import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Create an HTTP server (required for Socket.IO)
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow CORS for all origins
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve a simple HTML file for the client
app.get('/', (_, res) => {
  res.send("Welcome to Messenger-Msg-Services");
});

// Handle WebSocket connection using Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for incoming messages
  socket.on('message', (msg) => {
    console.log('Received message:', msg);
    console.log(socket.id);
    // Echo the message back to the client
    socket.emit('message', `Server response: ${msg}`);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Send a welcome message when a user connects
  socket.emit('message', 'Welcome to the Socket.IO server!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
