import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Define the payload structure for the JWT
interface JwtPayloadData {
  id: string; // User identifier
}

/**
 * Creates a JSON Web Token (JWT) for the provided payload data.
 *
 * @param {JwtPayloadData} data - The payload data to include in the JWT.
 * @returns {string} The signed JWT as a string.
 */
export const createJWT = (data: JwtPayloadData) => {
  return jwt.sign(
    { data },
    JWT_SECRET!,
  );
};

/**
 * Verifies a given JWT and returns the decoded payload.
 *
 * @param {string} token - The JWT to verify.
 * @returns {jwt.JwtPayload} The decoded JWT payload.
 * @throws {JsonWebTokenError} If the token is invalid or verification fails.
 */
export const verifyJWT = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;
  return decoded;
};
