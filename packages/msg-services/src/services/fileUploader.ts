import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * A class that handles file uploads to AWS S3.
 */
export class FileUploader {
  private _s3Client: S3Client;

  /**
   * Initializes a new instance of the FileUploader class.
   * Sets up the S3 client with the specified AWS region and credentials.
   */
  constructor() {
    this._s3Client = new S3Client({
      region: process.env.S3_BUCKET_REGION, // AWS region where the S3 bucket is hosted
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Your AWS access key ID
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // Your AWS secret access key
      },
    });
  }

  /**
   * Gets the S3 client instance.
   * @returns The S3 client.
   */
  get s3Client() {
    return this._s3Client;
  }

  /**
   * Uploads a base64 encoded file to S3.
   * @param file - The base64 encoded file string, including the content type.
   * @returns A promise that resolves to the URL of the uploaded file or an empty string in case of an error.
   */
  public async upload(file: string): Promise<string> {
    const base64Data = file.split(',')[1]; // Extract base64 part
    const buffer = Buffer.from(base64Data, 'base64'); // Decode base64 to a buffer

    // Extract the content type from the original file string
    const contentType = file.split(';')[0].split(':')[1];
    const key = `${Date.now()}.${contentType.split('/')[1]}`;

    try {
      const params = {
        Bucket: process.env.S3_SBUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: contentType, // Correct content type
      };

      const command = new PutObjectCommand(params);

      await this._s3Client.send(command);

      const url = `https://s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${process.env.S3_SBUCKET_NAME}/${key}`;
      return url;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      return '';
    }
  }
}
