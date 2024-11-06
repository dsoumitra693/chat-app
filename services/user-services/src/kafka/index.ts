import { Consumer, EachMessageHandler, Kafka, Producer } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { generateUUID } from 'shared';

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

  public async consume(topic: string, eachMessage: EachMessageHandler) {
    await this.connectConsumer(); // Ensure consumer is connected before subscribing

    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
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

export async function initConsumer() {
  const kafkaService = new KafkaService();
  await kafkaService.consume('account.create', async ({ message }) => {
    if (!message.value) {
      console.warn('Received empty message');
      return;
    }

    const id = generateUUID();
    const data = JSON.parse(message.value.toString());

    console.log(`Received message on 'account.create':`, data);

    try {
      await kafkaService.produce('user.create', id, {
        accountId: data.id,
        phone: data.phone,
        id,
        fullname: '',
      });
      console.log(
        `Produced message to 'user.create' for accountId: ${data.id}`
      );
    } catch (error) {
      console.error('Error producing user.create message:', error);
    }
  });
}
