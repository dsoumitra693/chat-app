import * as grpc from '@grpc/grpc-js';
import { loadPackageDefinition } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Path to the Proto file
const PROTO_PATH = path.resolve(__dirname, '../../proto/account.proto');

// Load the Proto file and handle any potential errors
let packageDefinition;
try {
  packageDefinition = protoLoader.loadSync(PROTO_PATH);
} catch (error) {
  process.exit(1); // Exit if the proto file loading fails
}

// Load the gRPC service package from the definition
const proto = loadPackageDefinition(packageDefinition).account as any;

// Ensure the DB_SERVICE_URL is defined in the environment variables
const dbServiceUrl = process.env.DB_SERVICE_URL;
if (!dbServiceUrl) {
  process.exit(1); // Exit if DB_SERVICE_URL is not set
}

// Create the gRPC client instance
export const grpcClient = new proto.AccountService(
  dbServiceUrl,
  grpc.credentials.createInsecure() // This can be updated for secure connections in production
);


