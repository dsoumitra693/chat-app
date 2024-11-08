import dotenv from 'dotenv';
import { initConsumers } from './services/kakfa-service';
import { GRPCService } from './services/grpc-service';

// Load environment variables from a .env file into process.env
dotenv.config();

/**
 * The port for the gRPC server to listen on.
 * @constant
 * @type {string}
 */
const PORT = process.env.PORT!; // Define the port for the server

/**
 * Instance of the GRPCService to manage the gRPC server.
 * @type {GRPCService}
 */
const grpcService = new GRPCService();

/**
 * Start the gRPC server.
 * @param {number} PORT - The port number where the gRPC server will listen.
 * @callback
 */
grpcService.start(PORT, (port) => {
  console.log(`Grpc server running at ${port}`);
});

/**
 * Initializes the Kafka consumers for handling message consumption.
 */
initConsumers();
