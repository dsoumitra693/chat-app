import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { db, DB } from '../db';

/**
 * Service class for interacting with the database using Drizzle ORM.
 *
 * This class provides methods for running raw SQL queries, inserting, reading, updating,
 * and deleting data from database tables.
 */
export class DBService {
  private db: DB;

  /**
   * Initializes the DBService class by setting up the database connection instance.
   */
  constructor() {
    this.db = db;
  }

  /**
   * Executes a raw SQL query.
   *
   * @param query - The raw SQL query as a string.
   * @returns A promise resolving to the result of the SQL query execution.
   */
  async runSQL(query: string) {
    return await this.db.execute(sql.raw(query));
  }

  /**
   * Inserts a batch of records into the specified database table.
   *
   * @param dataBatch - An array of data records to be inserted.
   * @param db_table - The database table into which data will be inserted.
   * @returns A promise resolving to the result of the batch insertion.
   */
  async insertBatch(dataBatch: string[], db_table: PgTableWithColumns<any>) {
    const parsedData = dataBatch.map((data) => JSON.parse(data));
    return await this.db.insert(db_table).values(parsedData);
  }

  /**
   * Batch updates user records in the database.
   *
   * @param updates - An array of objects containing the account ID and the new values to update.
   * @returns A promise resolving to the result of the batch update.
   */
  async updateBatch(
    updates: { id: string; updates: Record<string, any> }[] // Adjusted to string for UUID
  ): Promise<any> {
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }

    let phoneUpdates = "";
    let passwordUpdates = "";
    const ids: string[] = []; // Changed to string for UUID

    // Construct the CASE clauses for each column to be updated
    for (const { id, updates: updateFields } of updates) {
      if (!id) {
        console.warn(`Skipping update for invalid id: ${id}`);
        continue; // Skip if id is invalid
      }

      ids.push(id);
      const phoneUpdate = `WHEN '${id}' THEN '${updateFields.phone}'`;
      const passwordUpdate = `WHEN '${id}' THEN '${updateFields.password}'`;

      phoneUpdates += phoneUpdate + '\n'
      passwordUpdates += passwordUpdate + '\n'
    }

    if (ids.length === 0) {
      throw new Error('No valid accountIds provided for update');
    }

    const idList = ids.map((id) => `'${id}'`).join(',');

    // Construct the SQL query
    const query = `
    UPDATE account
      SET 
        phone = (
          CASE id
            ${phoneUpdates}
          END
        ),
        password = (
          CASE id
            ${passwordUpdates}
          END
        )
    WHERE id IN (${idList});
    `;

    try {
      const result = await this.runSQL(query);
      return result;
    } catch (error) {
      console.error('Error executing batch update:', error);
      throw new Error('Batch update failed');
    }
  }
}
