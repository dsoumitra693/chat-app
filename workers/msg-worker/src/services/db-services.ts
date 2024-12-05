import { Model } from 'mongoose';

/**
 * Service class for interacting with the database using Drizzle ORM.
 *
 * This class provides methods for running raw SQL queries, inserting, reading, updating,
 * and deleting data from database tables.
 */
export class DBService {
  /**
   * Inserts a batch of records into the specified database table.
   *
   * @param dataBatch - An array of data records to be inserted.
   * @param db_table - The database table into which data will be inserted.
   * @returns A promise resolving to the result of the batch insertion.
   */
  async insertBatch(dataBatch: string[], db_table: Model<any>) {
    const parsedData = dataBatch.map((data) => JSON.parse(data));
    return await db_table.insertMany(parsedData);
  }

  /**
   * Batch updates user records in the database.
   *
   * @param updates - An array of objects containing the account ID and the new values to update.
   * @returns A promise resolving to the result of the batch update.
   */

  async updateBatch(
    updates: { id: string; updates: Record<string, any> }[], // Array of updates
    db_table: Model<any>, // Mongoose model
  ): Promise<any> {
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }

    // Create bulk operations for batch processing
    const bulkOps = updates.map(({ id, updates }) => ({
      updateOne: {
        filter: { _id: id }, // Assuming `id` maps to the `_id` field in MongoDB
        update: { $set: updates },
      },
    }));

    try {
      // Perform the batch update using bulkWrite
      const result = await db_table.bulkWrite(bulkOps);
      return result; // Returns detailed information about the bulk operation
    } catch (error: any) {
      throw new Error(`Batch update failed: ${error.message}`);
    }
  }
}
