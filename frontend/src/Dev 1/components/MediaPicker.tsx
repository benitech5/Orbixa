import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  pickAndUploadGallery,
  pickAndUploadMusic,
  pickAndUploadVideo,
  pickAndUploadFile,
  takePhotoAndUpload,
  recordVideoAndUpload,
} from '../api/CloudinaryService';

interface MediaPickerProps {
  onFileSelected?: (fileUrl: string, fileType: string, fileName: string) => void;
  onError?: (error: string) => void;
  theme?: any;
  visible?: boolean;
  onClose?: () => void;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  onFileSelected,
  onError,
  theme,
  visible = false,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');

  const handleFileUpload = async (
    uploadFunction: () => Promise<string | null>,
    fileType: string,
    fileName: string
  ) => {
    setIsLoading(true);
    setLoadingType(fileType);
    
    try {
      const fileUrl = await uploadFunction();
      if (fileUrl) {
        onFileSelected?.(fileUrl, fileType, fileName);
        onClose?.();
      } else {
        onError?.('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingType('');
    }
  };

  const renderButton = (
    icon: string,
    title: string,
    onPress: () => void,
    type: string
  ) => (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme?.accent || '#007AFF' },
        isLoading && loadingType === type && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading && loadingType === type ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Ionicons name={icon as any} size={24} color="white" />
      )}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent,
          { backgroundColor: theme?.background || '#fff' }
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.headerTitle,
              { color: theme?.text || '#000' }
            ]}>
              Select Media
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme?.text || '#000'} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonGrid}>
            {renderButton(
              'images-outline',
              'Gallery',
              () => handleFileUpload(pickAndUploadGallery, 'image', 'Gallery Image'),
              'gallery'
            )}
            
            {renderButton(
              'musical-notes-outline',
              'Music',
              () => handleFileUpload(pickAndUploadMusic, 'audio', 'Music File'),
              'music'
            )}
            
            {renderButton(
              'videocam-outline',
              'Video',
              () => handleFileUpload(pickAndUploadVideo, 'video', 'Video File'),
              'video'
            )}
            
            {renderButton(
              'document-outline',
              'File',
              () => handleFileUpload(pickAndUploadFile, 'file', 'Document'),
              'file'
            )}
            
            {renderButton(
              'camera-outline',
              'Camera',
              () => handleFileUpload(takePhotoAndUpload, 'image', 'Camera Photo'),
              'camera'
            )}
            
            {renderButton(
              'videocam-outline',
              'Record',
              () => handleFileUpload(recordVideoAndUpload, 'video', 'Recorded Video'),
              'record'
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MediaPicker; 