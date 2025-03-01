/**
 * An in-memory key-value store with optional TTL support and additional utility functions.
 */
export class KVStore<K = string, V = string> {
  private static _instance: KVStore;
  private map: Map<K, { ex: number; value: V } | V>;

  /**
   * Private constructor to enforce the singleton pattern.
   */
  private constructor() {
    this.map = new Map();
  }

  /**
   * Retrieves the singleton instance of KVStore.
   * @returns The singleton KVStore instance.
   */
  public static getInstance(): KVStore {
    if (!KVStore._instance) {
      KVStore._instance = new KVStore();
    }
    return KVStore._instance;
  }

  /**
   * Retrieves the value associated with the given key.
   * If the key has expired, it is removed and null is returned.
   * @param key - The key to retrieve.
   * @returns The value or null if not found or expired.
   */
  public get(key: K): V | null {
    const data = this.map.get(key);
    if (data === undefined) return null;

    if (typeof data === 'object' && data !== null && 'ex' in data) {
      // If the key has expired, remove it and return null.
      if (data.ex < Date.now()) {
        this.del(key);
        return null;
      }
      return data.value;
    }
    return data as V;
  }

  /**
   * Stores a key-value pair without expiration.
   * @param key - The key to store.
   * @param value - The value to store.
   */
  public set(key: K, value: V): void {
    this.map.set(key, value);
  }

  /**
   * Stores a key-value pair with an expiration time (TTL) in milliseconds.
   * @param key - The key to store.
   * @param ex - Time-to-live in milliseconds.
   * @param value - The value to store.
   */
  public setex(key: K, ex: number, value: V): void {
    this.map.set(key, { ex: Date.now() + ex, value });
  }

  /**
   * Deletes the key-value pair associated with the given key.
   * @param key - The key to delete.
   */
  public del(key: K): void {
    this.map.delete(key);
  }

  /**
   * Checks if a key exists in the store and has not expired.
   * @param key - The key to check.
   * @returns True if the key exists and is not expired; false otherwise.
   */
  public exists(key: K): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clears all key-value pairs from the store.
   */
  public clear(): void {
    this.map.clear();
  }

  /**
   * Sets or updates the expiration time (TTL) for an existing key.
   * @param key - The key for which to update the TTL.
   * @param ttl - The new time-to-live in milliseconds.
   * @returns True if the TTL was updated; false if the key does not exist.
   */
  public expire(key: K, ttl: number): boolean {
    const data = this.map.get(key);
    if (data === undefined) {
      return false;
    }
    const value =
      typeof data === 'object' && data !== null && 'ex' in data
        ? data.value
        : data;
    this.map.set(key, { ex: Date.now() + ttl, value });
    return true;
  }

  /**
   * Retrieves the remaining time-to-live (TTL) for a key in milliseconds.
   * @param key - The key to check.
   * @returns The remaining TTL in milliseconds, -1 if no TTL is set, or null if the key doesn't exist or is expired.
   */
  public getTTL(key: K): number | null {
    const data = this.map.get(key);
    if (data === undefined) return null;
    if (typeof data === 'object' && data !== null && 'ex' in data) {
      const remaining = data.ex - Date.now();
      if (remaining <= 0) {
        this.del(key);
        return null;
      }
      return remaining;
    }
    return -1;
  }
}
