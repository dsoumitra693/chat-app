import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';

const bucketName = process.env.S3_SBUCKET_NAME!;

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
    const base64Data = file.split(',')[1]; // Extract the base64 part of the file
    const buffer = Buffer.from(base64Data, 'base64'); // Convert base64 to buffer for upload

    // Extract the content type (e.g., image/jpeg) from the original file string
    const contentType = file.split(';')[0].split(':')[1];
    const key = `${Date.now()}.${contentType.split('/')[1]}`; // Generate a unique filename with timestamp

    try {
      const params = {
        Bucket: bucketName, // S3 bucket name
        Key: key, // Unique file name key
        Body: buffer, // File content as buffer
        ContentType: contentType, // Correct content type
      };

      const command = new PutObjectCommand(params);

      await this.s3Client.send(command); // Send command to upload file to S3

      // Construct URL to access uploaded file on S3
      const url = `https://s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${bucketName}/${key}`;
      return url;
    } catch (error) {
      console.error('Error uploading to S3:', error); // Log upload error
      return ''; // Return an empty string in case of failure
    }
  }

  /**
   * Initiates a multipart upload to S3.
   * @param key - Unique identifier for the file in S3.
   * @param fileType - The MIME type of the file (e.g., image/jpeg).
   * @returns A promise that resolves to the upload ID for the initiated upload.
   */
  public async initiateMultipartUpload(key: string, fileType: string) {
    const multipartUploadParams = {
      Bucket: bucketName, // S3 bucket name
      Key: key, // Unique file name key
      ContentType: fileType, // File MIME type
    };

    const createMultipartUploadCommand = new CreateMultipartUploadCommand(
      multipartUploadParams
    );
    const { UploadId } = await this.s3Client.send(createMultipartUploadCommand); // Initiate multipart upload

    return UploadId; // Return the upload ID needed for further parts
  }

  /**
   * Uploads a single part of a multipart upload to S3.
   * @param key - Unique identifier for the file in S3.
   * @param uploadId - ID of the multipart upload session.
   * @param partNumber - Part number (sequence) for the chunk.
   * @param chunk - Buffer containing the file chunk to be uploaded.
   * @returns A promise that resolves to an object with the ETag of the uploaded part and its part number.
   */
  public async uploadPart(
    key: string,
    uploadId: string,
    partNumber: number,
    chunk: Buffer
  ) {
    const partUploadParams = {
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId, // Existing multipart upload ID
      PartNumber: partNumber, // Sequence number for this part
      Body: chunk, // File part content as buffer
    };

    try {
      const uploadPartCommand = new UploadPartCommand(partUploadParams);

      const { ETag } = await this.s3Client.send(uploadPartCommand); // Upload part and get ETag

      return {
        ETag, // Unique tag for the uploaded part
        partNumber,
      };
    } catch (error) {
      console.log(error);
      // Abort upload in case of an error with part upload
      return this.abortMultipartUpload(key, uploadId);
    }
  }

  /**
   * Completes a multipart upload, joining all uploaded parts into a single file.
   * @param key - Unique identifier for the file in S3.
   * @param uploadId - ID of the multipart upload session.
   * @param parts - Array of objects containing part numbers and their corresponding ETags.
   * @returns A promise that resolves to the location of the completed file or an error in case of failure.
   */
  public async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { partNumber: number; ETag: string }[]
  ) {
    const partUploadParams = {
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts, // List of parts with their ETags for verification
      },
    };
    try {
      const completeMultipartUploadCommand = new CompleteMultipartUploadCommand(
        partUploadParams
      );

      const { Location } = await this.s3Client.send(
        completeMultipartUploadCommand
      ); // Complete the multipart upload
      return Location; // Return the location of the file in S3
    } catch (error) {
      console.log(error);
      // Abort the multipart upload if completing it fails
      return this.abortMultipartUpload(key, uploadId);
    }
  }

  /**
   * Aborts a multipart upload, deleting all uploaded parts.
   * @param key - Unique identifier for the file in S3.
   * @param uploadId - ID of the multipart upload session to abort.
   * @throws Error when the upload is aborted due to an error.
   */
  public async abortMultipartUpload(key: string, uploadId: string) {
    const abortMultipartUploadParams = {
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId, // ID of the upload session to abort
    };
    const abortMultipartUploadCommand = new AbortMultipartUploadCommand(
      abortMultipartUploadParams
    );
    await this.s3Client.send(abortMultipartUploadCommand); // Abort upload
    return new Error('Multipart upload aborted due to an error');
  }
}
