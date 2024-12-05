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
 * Class for uploading files to AWS S3.
 * 
 * This class handles the configuration and methods required to upload files
 * to an S3 bucket.
 */
export { FileUploader } from './fileUploader';
