import { EachMessagePayload } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { DBService } from '../services/db-services';
import { Conversation, Message } from '../models';

export class KafkaConsumer {
  private consumer;
  private dbService = new DBService();
  private batchSize = 10; // Define batch size
  private batchInterval = 100; // Interval in milliseconds
  private batchMap: Record<string, string[]> = {};

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

  public async subscribe(topics: string[]) {
    try {
      await Promise.all(
        topics.map(async (topic) => {
          await this.consumer.subscribe({ topic, fromBeginning: true });
          console.log(`Kafka consumer subscribed to topic: ${topic}`);
        })
      );
    } catch (error) {
      console.error('Error subscribing to topics:', error);
    }
  }

  public async consume() {
    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const messageValue = message.value?.toString();
        console.log(messageValue, topic)
        if (messageValue) {
          // Push message to appropriate batch
          if (!this.batchMap[topic]) this.batchMap[topic] = [];
          this.batchMap[topic].push(messageValue);

          // Check if the batch size has been reached
          if (this.batchMap[topic].length >= this.batchSize) {
            await this.flushBatch(topic);
          }
        } else {
          console.warn(`Received empty message on topic '${topic}'`);
        }
      },
    });

    // Periodically flush remaining messages
    setInterval(() => {
      for (const topic in this.batchMap) {
        if (this.batchMap[topic].length > 0) {
          this.flushBatch(topic);
        }
      }
    }, this.batchInterval);
  }

  private async flushBatch(topic: string) {
    const batch = this.batchMap[topic];
    this.batchMap[topic] = []; // Reset batch array

    try {
      if (topic === 'conversation.create') {
        await this.dbService.insertBatch(batch, Conversation);
      } else if (topic === 'conversation.update') {
        // Parse the batch for updates
        const updates = batch.map((message) => {
          const { id, ...updates } = JSON.parse(message);
          return {
            id,
            updates,
          };
        });

        // Perform batch update
        await this.dbService.updateBatch(updates, Conversation);
      } else if (topic === 'message.create') {
        await this.dbService.insertBatch(batch, Message);
      } else if (topic === 'message.update') {
        // Parse the batch for updates
        const updates = batch.map((message) => {
          const { id, ...updates } = JSON.parse(message);
          return {
            id,
            updates,
          };
        });

        // Perform batch update
        await this.dbService.updateBatch(updates, Message);
      } else if (topic === 'lastmessage.update') {
        // Parse the batch for updates
        const updates = Array.from(
          batch
            .reduce((map, message) => {
              const { id, ...updates } = JSON.parse(message);
              map.set(id, { id, updates }); // Overwrite the entry if the id already exists
              return map;
            }, new Map())
            .values()
        );

        // Perform batch update
        await this.dbService.updateBatch(updates, Conversation);
      }
      console.log(
        `Batch inserted for topic '${topic}': ${batch.length} messages`
      );
    } catch (error) {
      // this.batchMap[topic].push(...batch);
      console.error(`Error inserting batch for topic '${topic}':`, error);
    }
  }
}

export async function initConsumers() {
  const kafkaConsumer = new KafkaConsumer();
  await kafkaConsumer.connect(); // Ensure connection before subscribing
  await kafkaConsumer.subscribe(['conversation.create', 'conversation.update','message.create']);
  await kafkaConsumer.consume();
}
