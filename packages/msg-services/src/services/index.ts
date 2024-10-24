/**
 * Exporting services and utilities for use in other parts of the application.
 * 
 * This module exports:
 * - Default export of SocketServices for handling socket connections.
 * - Redis utility functions for publishing and subscribing to messages.
 * - FileUploader class for handling file uploads to AWS S3.
 */

export { default as SocketServices } from './SocketServices';

/**
 * Publishes a message to a specified channel in Redis.
 * 
 * @param channel - The channel to publish the message to.
 * @param message - The message to be published.
 */
export { pub } from './redis';

/**
 * Subscribes to a specified channel in Redis to listen for messages.
 * 
 * @param channel - The channel to subscribe to.
 * @returns A promise that resolves when the subscription is established.
 */
export { sub } from './redis';

/**
 * Provides a key-value store interface for Redis.
 * 
 * This can be used for storing and retrieving key-value pairs in Redis.
 */
export { redisKV } from './redis';

/**
 * Class for uploading files to AWS S3.
 * 
 * This class handles the configuration and methods required to upload files
 * to an S3 bucket.
 */
export { FileUploader } from './fileUploader';
