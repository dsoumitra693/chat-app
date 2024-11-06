import * as grpc from '@grpc/grpc-js';
import { readAccountData, readUsersData } from '../controllers';
import { loadproto } from '../utils/load_proto';
import path from 'path';

const accountProtoPath = path.resolve(__dirname, '../proto/account.proto');
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const account_proto = loadproto(accountProtoPath);
const user_proto = loadproto(userProtoPath);

export class GRPCService {
  private _server: grpc.Server;

  constructor() {
    this._server = new grpc.Server();
    this.addServices();
  }

  get server() {
    return this._server;
  }

  private addServices() {
    // Access the AccountService from the loaded proto object
    const accountService = account_proto.account.AccountService.service;
    const userService = user_proto.user.UserService.service;

    const getAccountHandler = async (call: any, callback: any) => {
      const { phone, accountId } = call.request;
      const account = await readAccountData({ phone, accountId });
      callback(null, account);
    };

    const deleteAccountHandler = async (call: any, callback: any) => {
      callback(null, {});
    };

    const getUserHandler = async (call: any, callback: any) => {
      const { phone, userId } = call.request;
      const account = await readUsersData({ phone, userId });
      callback(null, account);
    };

    const deleteUserHandler = async (call: any, callback: any) => {
      callback(null, {});
    };

    // Add service to gRPC server
    this._server.addService(accountService, {
      GetAccount: getAccountHandler,
      DeleteAccount: deleteAccountHandler,
    });
    this._server.addService(userService, {
      GetUser: getUserHandler,
      DeleteUser: deleteUserHandler,
    });
  }

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
