import dotenv from 'dotenv';
import { initConsumers } from './services/kakfa-service';
import { GRPCService } from './services/grpc-service';

// Load environment variables from a .env file into process.env
dotenv.config();

const PORT = process.env.PORT!; // Define the port for the server

const grpcService = new GRPCService();

grpcService.start(PORT, (port) => {
  console.log(`Grpc server running at ${port}`);
});
initConsumers();
