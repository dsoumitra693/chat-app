import { v2 as cloudinary } from 'cloudinary';
import { generateUUID } from './uuid';

const uploadImage = (image: string) => {
    const id = generateUUID();
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            image,
            { public_id: id },
            function (error, result) {
                if (result && result.secure_url)
                    return resolve(result.secure_url);
                return reject(error);
            }
        );
    });
};

export default uploadImage;