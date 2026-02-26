'use server'

import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function upload(file: string, options?: UploadApiOptions) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',  
    ...options
  });
  return result.secure_url;
}

export async function uploadMultiple(files: string[], options?: UploadApiOptions) {
  const uploadPromises = files.map(file => upload(file, options));
  const urls = await Promise.all(uploadPromises);
  return urls;
}

export async function deleteFromCloudinary(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'auto'
  });
  if (result.result === 'ok') {
    console.log(`File with public ID ${publicId} deleted successfully.`);
    return true;
  } else {
    console.error(`Error deleting file from Cloudinary with public ID ${publicId}`);
    return false;
  }
}
