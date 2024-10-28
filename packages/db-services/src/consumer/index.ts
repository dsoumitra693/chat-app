import { kafka } from '../config/kafka.config';
import { EachMessageHandler } from 'kafkajs';
import { account } from 'shared';
import { DBService } from '../db';

export class KafkaConsumer {
  private consumer;

  constructor() {
    this.consumer = kafka.consumer({ groupId: 'default' });
  }

  public async connect() {
    try {
      await this.consumer.connect();
      console.log('Kafka consumer connected successfully');
    } catch (error) {
      console.error('Error connecting Kafka consumer:', error);
    }
  }

  public async consume(topic: string, eachMessage: EachMessageHandler) {
    try {
      await this.consumer.subscribe({ topic });
      await this.consumer.run({
        autoCommit: true,
        eachMessage,
      });
      console.log(`Kafka consumer subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error in Kafka consumer for topic ${topic}:`, error);
    }
  }
}

export async function initConsumers() {
  const kafkaConsumer = new KafkaConsumer();
  const dbService = new DBService();

  await kafkaConsumer.connect(); // Awaiting connection
  await kafkaConsumer.consume('account.create', async ({ message }) => {
    console.log(`Received message: ${message.value?.toString()}`);
    dbService.insert(message.value?.toString()!, account);
  });
}
