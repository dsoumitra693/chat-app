import { Producer } from 'kafkajs';
import { kafka } from '../config/kafka.config';

export class KafkaProducers {
  private producer: Producer;
  private isConnected: boolean = false;

  constructor() {
    this.producer = kafka.producer();
    console.log(this.producer)
    this.connect();
  }

  private async connect() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected successfully');
    } catch (error) {
      this.isConnected = false;
      console.error('Error connecting Kafka producer:', error);
    }
  }

  public async send(topic: string, key: string, value: any) {
    if (!this.isConnected) {
      await this.connect(); // Ensure producer is connected before sending
    }
    
    try {
      await this.producer.send({
        topic,
        messages: [{ key, value: JSON.stringify(value) }],
      });
      console.log(`Message sent to topic ${topic}: ${value}`);
    } catch (error) {
      console.error(`Error sending message to topic ${topic}:`, error);
    }
  }
}

// Instantiate the producer once and export the send function
const kafkaProducer = new KafkaProducers();
export const produceToKafka = (topic: string, key: string, value: any) =>
  kafkaProducer.send(topic, key, value);
