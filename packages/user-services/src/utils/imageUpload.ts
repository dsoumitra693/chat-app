import { v2 as cloudinary } from 'cloudinary';
import { generateUUID } from './uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (image: string) => {
  const id = generateUUID();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { public_id: id },
      function (error, result) {
        if (result && result.secure_url) return resolve(result.secure_url);
        return reject(error);
      }
    );
  });
};

export default uploadImage;
