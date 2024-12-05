import { config } from 'dotenv';
import { Kafka } from 'kafkajs';

config();


export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  clientId: 'messenger',
});
