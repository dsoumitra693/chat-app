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
   * Inserts data into the specified database table.
   *
   * @param data - The data to be inserted.
   * @param db_table - The database table into which data will be inserted.
   * @returns A promise resolving to the result of the insertion.
   */
  async insert(data: any, db_table: PgTableWithColumns<any>) {
    return await this.db.insert(db_table).values(data);
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
   * Deletes data from the specified database table based on a query condition.
   *
   * @param query - The query condition to filter which rows to delete.
   * @param db_table - The database table from which data will be deleted.
   * @returns A promise resolving to the result of the deletion operation.
   */
  async delete(query: any, db_table: PgTableWithColumns<any>) {
    return await db.delete(db_table).where(query);
  }
}
