import * as bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Generates a hash from a given password.
 *
 * @param {string} data - The password to hash.
 * @returns {string} The hashed password.
 * @throws {Error} If the provided password is empty.
 */
export const getHash = (data: string): string => {
  if (data.length === 0) throw new Error('Password should not be empty');
  const hash = bcrypt.hashSync(data, saltRounds);
  return hash;
};

/**
 * Compares a given password with its hashed value to verify if they match.
 *
 * @param {string} data - The password to compare.
 * @param {string} hash - The hashed password to compare against.
 * @returns {boolean} True if the password matches the hash; otherwise, false.
 */
export const compareHash = (data: string, hash: string): boolean => {
  return bcrypt.compareSync(data, hash);
};
