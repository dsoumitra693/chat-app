import { Kafka } from 'kafkajs';
import { config } from 'dotenv';

config();

export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  clientId: 'messenger',
});