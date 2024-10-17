// src/utils/jwt.ts

import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET } = process.env;

// Define the payload structure
interface JwtPayloadData {
  id: string;
}

export const createJWT = (data: JwtPayloadData) => {
  return jwt.sign(
    { data },
    JWT_SECRET!,
  );
};

export const verifyJWT = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;
  return decoded;
};
