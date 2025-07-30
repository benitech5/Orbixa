import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { CLOUDINARY_CONFIG } from './cloudinaryConfig';

// Generic file upload function
const uploadFileToCloudinary = async (fileUri: string, fileName: string, fileType: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: fileType,
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
};

// Gallery/Image picker
export const pickAndUploadGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.fileName || `gallery_${Date.now()}.jpg`;
    const fileType = asset.type || 'image/jpeg';
    
    return await uploadFileToCloudinary(asset.uri, fileName, fileType);
  }
  return null;
};

// Music picker
export const pickAndUploadMusic = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      'audio/*',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/aac',
      'audio/ogg',
      'audio/flac'
    ],
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.name || `music_${Date.now()}.mp3`;
    const fileType = asset.mimeType || 'audio/mpeg';
    
    return await uploadFileToCloudinary(asset.uri, fileName, fileType);
  }
  return null;
};

// Video picker
export const pickAndUploadVideo = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.fileName || `video_${Date.now()}.mp4`;
    const fileType = asset.type || 'video/mp4';
    
    return await uploadFileToCloudinary(asset.uri, fileName, fileType);
  }
  return null;
};

// General file picker
export const pickAndUploadFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.name || `file_${Date.now()}`;
    const fileType = asset.mimeType || 'application/octet-stream';
    
    return await uploadFileToCloudinary(asset.uri, fileName, fileType);
  }
  return null;
};

// Legacy functions for backward compatibility
export const pickAndUploadImage = async () => {
  return await pickAndUploadGallery();
};

// Camera picker for taking photos
export const takePhotoAndUpload = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera permissions to make this work!');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.fileName || `camera_${Date.now()}.jpg`;
    const fileType = asset.type || 'image/jpeg';
    
    return await uploadFileToCloudinary(asset.uri, fileName, fileType);
  }
  return null;
};

// Video recording and upload
export const recordVideoAndUpload = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera permissions to make this work!');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const fileName = asset.fileName || `video_${Date.now()}.mp4`;
    const fileType = asset.type || 'video/mp4';
    
    return await uploadFileToCloudinary(asset.uri, fileName, fileType);
  }
  return null;
}; 