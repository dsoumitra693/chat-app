import { Consumer, EachMessageHandler, Kafka, Producer } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { generateUUID } from '../utils/generateUUID';
import { ConversationService } from '../services/conversationService';

export class KafkaService {
  private producer: Producer;
  private consumer: Consumer;
  private isProducerConnected: boolean = false;
  private isConsumerConnected: boolean = false;

  constructor() {
    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId: 'default-1' });
  }

  private async connectProducer() {
    if (!this.isProducerConnected) {
      try {
        await this.producer.connect();
        this.isProducerConnected = true;
        console.log('Kafka producer connected successfully');
      } catch (error) {
        console.error('Error connecting Kafka producer:', error);
      }
    }
  }

  private async connectConsumer() {
    if (!this.isConsumerConnected) {
      try {
        await this.consumer.connect();
        this.isConsumerConnected = true;
        console.log('Kafka consumer connected successfully');
      } catch (error) {
        console.error('Error connecting Kafka consumer:', error);
      }
    }
  }

  public async produce(topic: string, key: string, value: any) {
    await this.connectProducer(); // Ensure producer is connected before sending

    try {
      await this.producer.send({
        topic,
        messages: [{ key, value: JSON.stringify(value) }],
      });
      console.log(`Message sent to topic ${topic}:`, value);
    } catch (error) {
      console.error(`Error sending message to topic ${topic}:`, error);
    }
  }

  public async consume(eachMessage: EachMessageHandler) {
    await this.connectConsumer(); // Ensure consumer is connected before subscribing
    await this.consumer.run({
      autoCommit: true,
      eachMessage,
    });
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
}

export async function initConsumer() {
  const kafkaService = new KafkaService();
  const conversationService = new ConversationService();
  await kafkaService.consume(async ({ topic, message }) => {
    if (!message.value) {
      console.warn('Received empty message');
      return;
    }

    const id = generateUUID();
    const data = JSON.parse(message.value.toString());

    if (topic == 'message.create') {
      conversationService.updateLastMessage(data.conversationId, {
        messageId: data.messageId,
        content: data.content,
        timestamp: data.timestamps,
      });
    } else if (topic == 'usercontact.created') {
      conversationService.create(data.userId, data.contactUserId);
    }
  });
}

// Instantiate the producer once and export the send function
const kafkaProducer = new KafkaService();
export const produceToKafka = (topic: string, key: string, value: any) =>
  kafkaProducer.produce(topic, key, value);
