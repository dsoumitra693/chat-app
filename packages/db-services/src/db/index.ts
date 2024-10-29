import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { db, DB } from './db';
import { sql } from 'drizzle-orm';

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
   * Inserts a single record into the specified database table.
   *
   * @param data - The data to be inserted as a string.
   * @param db_table - The database table into which data will be inserted.
   * @returns A promise resolving to the result of the insertion.
   */
  async insert(data: string, db_table: PgTableWithColumns<any>) {
    return await this.db.insert(db_table).values(JSON.parse(data));
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
   * Reads data from the specified database table based on a query condition.
   *
   * @param query - The query condition to filter the data.
   * @param db_table - The database table from which data will be read.
   * @returns A promise resolving to the result of the query.
   */
  async read(query: any, db_table: PgTableWithColumns<any>) {
    const data = await this.db.select().from(db_table).where(query);
    return data;
  }

  /**
   * Updates data in the specified database table based on a query condition.
   *
   * @param data - The data to be updated.
   * @param query - The query condition to filter which rows to update.
   * @param db_table - The database table where the update will occur.
   * @returns A promise resolving to the result of the update operation.
   */
  async update(data: any, query: any, db_table: PgTableWithColumns<any>) {
    return await this.db.update(db_table).set(data).where(query);
  }

  /**
   * Batch updates user records in the database.
   *
   * @param updates - An array of objects containing the account ID and the new values to update.
   * @returns A promise resolving to the result of the batch update.
   */
  async updateBatch(
    updates: { accountId: string; updates: Record<string, any> }[], // Adjusted to string for UUID
    tableName: string
  ): Promise<any> {
    if (updates.length === 0) {
      throw new Error('No updates provided');
    }

    const columns = Object.keys(updates[0].updates);
    const setClauses: string[] = [];
    const ids: string[] = []; // Changed to string for UUID

    // Construct the CASE clauses for each column to be updated
    for (const { accountId, updates: updateFields } of updates) {
      if (!accountId) {
        console.warn(`Skipping update for invalid accountId: ${accountId}`);
        continue; // Skip if accountId is invalid
      }

      ids.push(accountId); // Collect valid accountIds

      const caseClauses = columns
        .map((column) => {
          const value = updateFields[column];
          if (value !== undefined && value !== null) {
            const escapedValue = value.toString().replace(/'/g, "''"); // Escape single quotes
            return `${column} = CASE WHEN account_id = '${accountId}' THEN '${escapedValue}' END`; // Use single quotes for UUID
          }
          return null; // Handle undefined values gracefully
        })
        .filter((clause) => clause !== null); // Remove null entries

      setClauses.push(...caseClauses); // Add to the main set clauses
    }

    if (ids.length === 0) {
      throw new Error('No valid accountIds provided for update');
    }

    const idList = ids.map((id) => `'${id}'`).join(','); // Wrap UUIDs in single quotes

    // Construct the SQL query
    const query = `
      UPDATE ${tableName}
      SET 
        ${setClauses.join(', ')}
      WHERE account_id IN (${idList});
    `;

    try {
      console.log('Executing query:', query); // Log the query for debugging
      const result = await this.runSQL(query);
      return result;
    } catch (error) {
      console.error('Error executing batch update:', error);
      throw new Error('Batch update failed');
    }
  }

  /**
   * Deletes data from the specified database table based on a query condition.
   *
   * @param query - The query condition to filter which rows to delete.
   * @param db_table - The database table from which data will be deleted.
   * @returns A promise resolving to the result of the deletion operation.
   */
  async delete(query: any, db_table: PgTableWithColumns<any>) {
    return await this.db.delete(db_table).where(query);
  }
}
