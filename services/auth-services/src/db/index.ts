import { Account } from '../account';
import { grpcClient } from '../grpc';

/**
 * Fetches an account by either phone number or account ID.
 *
 * @param {Object} params - The parameters for fetching the account.
 * @param {string} [params.phone] - The phone number associated with the account.
 * @param {string} [params.accountId] - The account ID to retrieve.
 * @returns {Promise<Account>} - A promise that resolves to the account if found.
 * @throws {Error} - If there is an error with the gRPC call or the account doesn't exist.
 */
export const getAccount = async ({
  phone,
  accountId,
}: {
  phone?: string;
  accountId?: string;
}): Promise<Account> => {
  return new Promise((resolve, reject) => {
    grpcClient.GetAccount({ phone, accountId }, (error: any, response: any) => {
      if (error) {
        reject(new Error(`Failed to fetch account: ${error.message}`));
      } else if (!response || !response.account) {
        reject(new Error('Account not found'));
      } else {
        const _account = new Account(
          response.account.phone,
          response.account.password,
          response.account.id
        );
        resolve(_account);
      }
    });
  });
};

/**
 * Deletes an account by phone number or account ID.
 *
 * @param {Object} params - The parameters for deleting the account.
 * @param {string} [params.phone] - The phone number associated with the account.
 * @param {string} [params.accountId] - The account ID to delete.
 * @returns {Promise<any>} - A promise that resolves with the response if successful.
 * @throws {Error} - If there is an error with the gRPC call.
 */
export const deleteAccount = async ({
  phone,
  accountId,
}: {
  phone?: string;
  accountId?: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    grpcClient.DeleteAccount(
      { phone, accountId },
      (error: any, response: any) => {
        if (error) {
          reject(new Error(`Failed to delete account: ${error.message}`));
        } else {
          resolve(response);
        }
      }
    );
  });
};
