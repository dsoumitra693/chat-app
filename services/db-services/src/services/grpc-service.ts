import * as grpc from '@grpc/grpc-js';
import { readAccountData, readUsersData } from '../controllers';
import { loadproto } from '../utils/load_proto';
import path from 'path';

// Define the paths for the proto files
const accountProtoPath = path.resolve(__dirname, '../../proto/account.proto');
const userProtoPath = path.resolve(__dirname, '../../proto/user.proto');

// Load the proto files
const account_proto = loadproto(accountProtoPath);
const user_proto = loadproto(userProtoPath);

/**
 * GRPCService class provides methods to handle gRPC services related to accounts and users.
 * It manages the creation and setup of a gRPC server, as well as handling requests.
 */
export class GRPCService {
  private _server: grpc.Server;

  /**
   * Creates a new instance of GRPCService and initializes the gRPC server.
   */
  constructor() {
    this._server = new grpc.Server();
    this.addServices();
  }

  /**
   * Returns the gRPC server instance.
   * @returns The gRPC server instance.
   */
  get server() {
    return this._server;
  }

  /**
   * Adds services to the gRPC server. This includes handlers for account and user services.
   * It sets up the methods that can be invoked via gRPC.
   */
  private addServices() {
    // Access the AccountService and UserService from the loaded proto objects
    const accountService = account_proto.account.AccountService.service;
    const userService = user_proto.user.UserService.service;

    // Handler for fetching account data
    const getAccountHandler = async (call: any, callback: any) => {
      const { phone, accountId } = call.request;
      try {
        if (!phone && !accountId) {
          // Validate request data
          const grpcError = {
            code: grpc.status.INVALID_ARGUMENT,
            details: 'Phone and AccountId are required',
          };
          return callback(grpcError, null);
        }

        // Retrieve account data from the database
        const account = await readAccountData({ phone, accountId });
        if (!account) {
          // Handle case where account is not found
          const grpcError = {
            code: grpc.status.NOT_FOUND,
            details: 'Account not found',
          };
          return callback(grpcError, null);
        }

        callback(null, { account });
      } catch (error) {
        // Handle unexpected errors
        console.error('Error retrieving account:', error);
        const grpcError = {
          code: grpc.status.INTERNAL,
          details: 'Internal Server Error',
        };
        callback(grpcError, null);
      }
    };

    // Handler for deleting account (currently not implemented)
    const deleteAccountHandler = async (call: any, callback: any) => {
      callback(null, {});
    };

    // Handler for fetching user data
    const getUserHandler = async (call: any, callback: any) => {
      const { phone, userId } = call.request;
      try {
        if (!phone && !userId) {
          // Validate request data
          const grpcError = {
            code: grpc.status.INVALID_ARGUMENT,
            details: 'Phone and UserId are required',
          };
          return callback(grpcError, null);
        }

        // Retrieve user data from the database
        const user = await readUsersData({ phone, userId });
        if (!user) {
          // Handle case where user is not found
          const grpcError = {
            code: grpc.status.NOT_FOUND,
            details: 'User not found',
          };
          return callback(grpcError, null);
        }

        callback(null, { user });
      } catch (error) {
        // Handle unexpected errors
        console.error('Error retrieving user:', error);
        const grpcError = {
          code: grpc.status.INTERNAL,
          details: 'Internal Server Error',
        };
        callback(grpcError, null);
      }
    };

    // Handler for deleting user (currently not implemented)
    const deleteUserHandler = async (call: any, callback: any) => {
      callback(null, {});
    };

    // Add services to gRPC server
    this._server.addService(accountService, {
      GetAccount: getAccountHandler,
      DeleteAccount: deleteAccountHandler,
    });
    this._server.addService(userService, {
      GetUser: getUserHandler,
      DeleteUser: deleteUserHandler,
    });
  }

  /**
   * Starts the gRPC server.
   * @param port - The port number on which the server will listen.
   * @param callback - An optional callback that will be called once the server starts.
   */
  public start(port: number | string, callback?: (port: number) => any) {
    this._server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (error, bindPort) => {
        if (error) {
          console.error(`Failed to bind server: ${error.message}`);
          return;
        }
        if (callback) {
          callback(bindPort);
        }
      }
    );
  }
}
