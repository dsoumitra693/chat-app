import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new universally unique identifier (UUID).
 *
 * @returns {string} A randomly generated UUID.
 */
export function generateUUID(): string {
  return uuidv4();
}
