import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { CLOUDINARY_CONFIG } from './cloudinaryConfig';

export const pickAndUploadImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const formData = new FormData();
    formData.append('file', {
      uri: result.assets[0].uri,
      name: 'chatmedia.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }
  return null;
};

export const pickAndUploadVideo = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const formData = new FormData();
    formData.append('file', {
      uri: result.assets[0].uri,
      name: 'chatvideo.mp4',
      type: 'video/mp4',
    } as any);
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }
  return null;
}; 