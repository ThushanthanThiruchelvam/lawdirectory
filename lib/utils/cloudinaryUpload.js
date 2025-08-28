import cloudinary from '@/lib/config/cloudinary';

export const uploadToCloudinary = async (fileBuffer, folder = 'uploads') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Upload function error:', error);
    throw error;
  }
};

// Extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url) => {
  try {
    // Extract public_id from Cloudinary URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicIdWithExtension = filename.split('.')[0]; // Remove file extension
    
    // If the image is in a folder, we need to include the folder path
    const folderIndex = parts.indexOf('upload') + 2; // Skip 'upload' and version number
    if (folderIndex < parts.length - 1) {
      const folderPath = parts.slice(folderIndex, parts.length - 1).join('/');
      return `${folderPath}/${publicIdWithExtension}`;
    }
    
    return publicIdWithExtension;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    throw new Error('Invalid Cloudinary URL');
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};