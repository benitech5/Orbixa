import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MediaPicker from './MediaPicker';
import {
  pickAndUploadGallery,
  pickAndUploadMusic,
  pickAndUploadVideo,
  pickAndUploadFile,
} from '../api/CloudinaryService';

interface MediaUploadExampleProps {
  theme?: any;
}

const MediaUploadExample: React.FC<MediaUploadExampleProps> = ({ theme }) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    type: string;
    name: string;
    timestamp: Date;
  }>>([]);

  const handleFileSelected = (fileUrl: string, fileType: string, fileName: string) => {
    const newFile = {
      url: fileUrl,
      type: fileType,
      name: fileName,
      timestamp: new Date(),
    };
    setUploadedFiles(prev => [newFile, ...prev]);
    Alert.alert(
      'Upload Successful!',
      `${fileName} has been uploaded to Cloudinary.`,
      [{ text: 'OK' }]
    );
  };

  const handleUploadError = (error: string) => {
    Alert.alert('Upload Error', error);
  };

  const handleDirectUpload = async (uploadFunction: () => Promise<string | null>, type: string) => {
    try {
      const fileUrl = await uploadFunction();
      if (fileUrl) {
        handleFileSelected(fileUrl, type, `${type} file`);
      } else {
        handleUploadError('Upload failed');
      }
    } catch (error) {
      handleUploadError('Upload failed. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.background || '#fff' }]}>
      <Text style={[styles.title, { color: theme?.text || '#000' }]}>
        Media Upload Example
      </Text>
      
      <Text style={[styles.description, { color: theme?.textSecondary || '#666' }]}>
        Test different file upload options. Files will be uploaded to Cloudinary.
      </Text>

      {/* Direct Upload Buttons */}
      <View style={styles.directUploadSection}>
        <Text style={[styles.sectionTitle, { color: theme?.accent || '#007AFF' }]}>
          Quick Upload Options
        </Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: theme?.accent || '#007AFF' }]}
            onPress={() => handleDirectUpload(pickAndUploadGallery, 'image')}
          >
            <Ionicons name="images-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: theme?.accent || '#007AFF' }]}
            onPress={() => handleDirectUpload(pickAndUploadMusic, 'audio')}
          >
            <Ionicons name="musical-notes-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Music</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: theme?.accent || '#007AFF' }]}
            onPress={() => handleDirectUpload(pickAndUploadVideo, 'video')}
          >
            <Ionicons name="videocam-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: theme?.accent || '#007AFF' }]}
            onPress={() => handleDirectUpload(pickAndUploadFile, 'file')}
          >
            <Ionicons name="document-outline" size={20} color="white" />
            <Text style={styles.buttonText}>File</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Media Picker Button */}
      <TouchableOpacity
        style={[styles.mediaPickerButton, { backgroundColor: theme?.accent || '#007AFF' }]}
        onPress={() => setShowMediaPicker(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.mediaPickerButtonText}>Open Media Picker</Text>
      </TouchableOpacity>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <View style={styles.uploadedFilesSection}>
          <Text style={[styles.sectionTitle, { color: theme?.accent || '#007AFF' }]}>
            Recently Uploaded Files
          </Text>
          <ScrollView style={styles.filesList}>
            {uploadedFiles.map((file, index) => (
              <View key={index} style={[styles.fileItem, { backgroundColor: theme?.cardBackground || '#F2F2F7' }]}>
                <View style={styles.fileIcon}>
                  <Ionicons
                    name={
                      file.type === 'image' ? 'image' :
                      file.type === 'video' ? 'videocam' :
                      file.type === 'audio' ? 'musical-notes' : 'document'
                    }
                    size={20}
                    color={theme?.accent || '#007AFF'}
                  />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={[styles.fileName, { color: theme?.text || '#000' }]} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={[styles.fileTimestamp, { color: theme?.textSecondary || '#666' }]}>
                    {file.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => {
                    // In a real app, you might want to copy to clipboard
                    Alert.alert('File URL', file.url);
                  }}
                >
                  <Ionicons name="copy-outline" size={16} color={theme?.accent || '#007AFF'} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Media Picker Modal */}
      <MediaPicker
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onFileSelected={handleFileSelected}
        onError={handleUploadError}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  directUploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  uploadButton: {
    width: '48%',
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  mediaPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  mediaPickerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadedFilesSection: {
    flex: 1,
  },
  filesList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
  },
  fileTimestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  copyButton: {
    padding: 8,
  },
});

export default MediaUploadExample; 