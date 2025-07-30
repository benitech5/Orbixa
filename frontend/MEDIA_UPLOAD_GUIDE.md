# Media Upload to Cloudinary Guide

This guide explains how to use the enhanced media upload functionality that allows users to pick files from their device's local storage and upload them to Cloudinary.

## Features

- **Gallery/Image Picker**: Select images from device gallery
- **Music Picker**: Select audio files (MP3, WAV, AAC, OGG, FLAC)
- **Video Picker**: Select videos from device gallery
- **File Picker**: Select any type of file from device storage
- **Camera Integration**: Take photos and record videos directly
- **Cloudinary Upload**: Automatic upload to your Cloudinary account
- **Progress Indicators**: Loading states during upload
- **Error Handling**: Comprehensive error handling and user feedback

## Installation Steps

### 1. Install Dependencies

Run this command in your terminal:

```bash
cd frontend
npm install expo-document-picker
```

### 2. Verify Cloudinary Configuration

Make sure your Cloudinary configuration is set up in `src/Dev 1/api/cloudinaryConfig.ts`:

```typescript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'your_cloud_name',
  UPLOAD_PRESET: 'your_upload_preset'
};
```

## Usage

### Method 1: Using the MediaPicker Component

The `MediaPicker` component provides a modal interface with all upload options:

```typescript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MediaPicker from '../components/MediaPicker';

const MyComponent = () => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleFileSelected = (fileUrl: string, fileType: string, fileName: string) => {
    console.log('File uploaded:', { fileUrl, fileType, fileName });
    // Handle the uploaded file URL
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // Handle upload errors
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowMediaPicker(true)}>
        <Text>Upload Media</Text>
      </TouchableOpacity>

      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onFileSelected={handleFileSelected}
        onError={handleUploadError}
        theme={theme} // Optional: pass your theme object
      />
    </View>
  );
};
```

### Method 2: Direct Function Calls

You can also call the upload functions directly:

```typescript
import {
  pickAndUploadGallery,
  pickAndUploadMusic,
  pickAndUploadVideo,
  pickAndUploadFile,
  takePhotoAndUpload,
  recordVideoAndUpload,
} from '../api/CloudinaryService';

// Upload from gallery
const handleGalleryUpload = async () => {
  const fileUrl = await pickAndUploadGallery();
  if (fileUrl) {
    console.log('Gallery image uploaded:', fileUrl);
  }
};

// Upload music file
const handleMusicUpload = async () => {
  const fileUrl = await pickAndUploadMusic();
  if (fileUrl) {
    console.log('Music file uploaded:', fileUrl);
  }
};

// Upload video
const handleVideoUpload = async () => {
  const fileUrl = await pickAndUploadVideo();
  if (fileUrl) {
    console.log('Video uploaded:', fileUrl);
  }
};

// Upload any file
const handleFileUpload = async () => {
  const fileUrl = await pickAndUploadFile();
  if (fileUrl) {
    console.log('File uploaded:', fileUrl);
  }
};

// Take photo with camera
const handleCameraPhoto = async () => {
  const fileUrl = await takePhotoAndUpload();
  if (fileUrl) {
    console.log('Camera photo uploaded:', fileUrl);
  }
};

// Record video with camera
const handleCameraVideo = async () => {
  const fileUrl = await recordVideoAndUpload();
  if (fileUrl) {
    console.log('Camera video uploaded:', fileUrl);
  }
};
```

## Available Functions

### Core Upload Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `pickAndUploadGallery()` | Pick image from gallery | `Promise<string \| null>` |
| `pickAndUploadMusic()` | Pick audio file | `Promise<string \| null>` |
| `pickAndUploadVideo()` | Pick video from gallery | `Promise<string \| null>` |
| `pickAndUploadFile()` | Pick any file type | `Promise<string \| null>` |
| `takePhotoAndUpload()` | Take photo with camera | `Promise<string \| null>` |
| `recordVideoAndUpload()` | Record video with camera | `Promise<string \| null>` |

### Legacy Functions (Backward Compatibility)

| Function | Description |
|----------|-------------|
| `pickAndUploadImage()` | Alias for `pickAndUploadGallery()` |

## MediaPicker Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `visible` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Called when modal is closed |
| `onFileSelected` | `(fileUrl: string, fileType: string, fileName: string) => void` | Yes | Called when file is successfully uploaded |
| `onError` | `(error: string) => void` | No | Called when upload fails |
| `theme` | `object` | No | Theme object for styling |

## File Types Supported

### Images
- JPEG, PNG, GIF, WebP, HEIC

### Audio
- MP3, WAV, AAC, OGG, FLAC, M4A

### Video
- MP4, MOV, AVI, MKV, WebM

### Documents
- PDF, DOC, DOCX, TXT, RTF
- XLS, XLSX, PPT, PPTX
- ZIP, RAR, 7Z
- And any other file type

## Permissions Required

The following permissions are automatically requested when needed:

- **Camera**: For taking photos and recording videos
- **Media Library**: For accessing gallery images and videos
- **File Access**: For selecting documents and files

## Error Handling

The system handles various error scenarios:

- **Permission Denied**: Shows appropriate error message
- **Upload Failed**: Network or Cloudinary API errors
- **File Selection Cancelled**: Gracefully handles user cancellation
- **Invalid File Type**: Validates file types before upload

## Integration Examples

### In Chat Screen

```typescript
// Add to your chat input component
const handleMediaUpload = async (type: string) => {
  let fileUrl: string | null = null;
  
  switch (type) {
    case 'gallery':
      fileUrl = await pickAndUploadGallery();
      break;
    case 'camera':
      fileUrl = await takePhotoAndUpload();
      break;
    case 'video':
      fileUrl = await pickAndUploadVideo();
      break;
    case 'file':
      fileUrl = await pickAndUploadFile();
      break;
  }
  
  if (fileUrl) {
    // Send message with media
    sendMessage({
      type: 'media',
      content: fileUrl,
      mediaType: type
    });
  }
};
```

### In Settings Screen

The `DataAndStorageScreen` now includes a media upload section where users can test the functionality.

## Testing

1. Navigate to Settings → Data and Storage
2. Tap "Upload Media" button
3. Select any media type
4. Choose a file from your device
5. Wait for upload to complete
6. Check the uploaded files list

## Troubleshooting

### Common Issues

1. **Upload fails**: Check your Cloudinary credentials and upload preset
2. **Permission denied**: Ensure app has necessary permissions
3. **File not found**: Verify file exists and is accessible
4. **Network error**: Check internet connection

### Debug Tips

- Check console logs for detailed error messages
- Verify Cloudinary configuration
- Test with smaller files first
- Ensure upload preset allows the file types you're trying to upload

## Security Considerations

- Files are uploaded directly to Cloudinary
- No files are stored locally on the device after upload
- Cloudinary URLs are secure and can be made private
- Consider implementing file size limits
- Validate file types on the server side as well

## Performance Notes

- Large files may take time to upload
- Progress indicators show upload status
- Files are compressed when possible
- Consider implementing upload queues for multiple files

## Future Enhancements

- Batch upload functionality
- Upload progress tracking
- File compression options
- Custom upload presets
- Offline upload queue
- File preview before upload 