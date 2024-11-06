import { v2 as cloudinary } from 'cloudinary';
import { generateUUID } from './uuid';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * 
 * @param image - The image file or URL to upload. It can be a local file path or a remote URL.
 * 
 * @returns A promise that resolves with the secure URL of the uploaded image.
 * 
 * @throws {Error} If the upload fails.
 */
const uploadImage = (image: string): Promise<string> => {
  const id = generateUUID(); // Generate a unique ID for the image
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { public_id: id }, // Set the public ID to the generated UUID
      function (error, result) {
        if (result && result.secure_url) return resolve(result.secure_url); // Resolve with the secure URL
        return reject(error); // Reject the promise with the error
      }
    );
  });
};

export default uploadImage;
