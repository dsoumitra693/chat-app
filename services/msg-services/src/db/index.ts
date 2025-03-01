import { config } from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

config();

const { MONGO_DB_URL } = process.env;

export const connectToDB = async () => {
  console.log(MONGO_DB_URL!);
  mongoose
    .connect(MONGO_DB_URL!)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection error:', err));
};
