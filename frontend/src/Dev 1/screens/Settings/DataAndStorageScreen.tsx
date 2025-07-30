import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import SettingsHeader from './SettingsHeader';
import { useSettings } from '../../SettingsContext';
import MediaPicker from '../../components/MediaPicker';
import { Ionicons } from '@expo/vector-icons';

const DataAndStorageScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string, type: string, name: string}>>([]);
  
  const {
    dataAndStorageSettings,
    updateDataAndStorageSetting,
    resetDataAndStorageSettings,
  } = useSettings();

  const handleFileSelected = (fileUrl: string, fileType: string, fileName: string) => {
    setUploadedFiles(prev => [...prev, { url: fileUrl, type: fileType, name: fileName }]);
    Alert.alert(
      'Upload Successful!',
      `${fileName} has been uploaded to Cloudinary.\nURL: ${fileUrl}`,
      [{ text: 'OK' }]
    );
  };

  const handleUploadError = (error: string) => {
    Alert.alert('Upload Error', error);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SettingsHeader title="Data and Storage" onBack={navigation.goBack} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 24 }}>
        
        {/* Media Upload Section */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Media Upload</Text>
        <Text style={[styles.sectionDescription, { color: theme?.textSecondary || '#666666' }]}>
          Upload files from your device to Cloudinary
        </Text>
        
        <TouchableOpacity 
          style={[styles.uploadButton, { backgroundColor: theme.accent }]}
          onPress={() => setShowMediaPicker(true)}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
          <Text style={styles.uploadButtonText}>Upload Media</Text>
        </TouchableOpacity>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <View style={styles.uploadedFilesSection}>
            <Text style={[styles.sectionTitle, { color: theme.accent }]}>Recently Uploaded</Text>
            {uploadedFiles.slice(-3).map((file, index) => (
              <View key={index} style={[styles.fileItem, { backgroundColor: theme?.cardBackground || '#F2F2F7' }]}>
                <Ionicons 
                  name={file.type === 'image' ? 'image' : file.type === 'video' ? 'videocam' : file.type === 'audio' ? 'musical-notes' : 'document'} 
                  size={20} 
                  color={theme.accent} 
                />
                <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
                  {file.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Automatic media download */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Automatic media download</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>When using mobile data</Text>
          <Switch
            value={dataAndStorageSettings.autoDownloadMobileData}
            onValueChange={v => updateDataAndStorageSetting('autoDownloadMobileData', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>When connected to Wi-Fi</Text>
          <Switch
            value={dataAndStorageSettings.autoDownloadWifi}
            onValueChange={v => updateDataAndStorageSetting('autoDownloadWifi', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>When roaming</Text>
          <Switch
            value={dataAndStorageSettings.autoDownloadRoaming}
            onValueChange={v => updateDataAndStorageSetting('autoDownloadRoaming', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
        <TouchableOpacity onPress={resetDataAndStorageSettings}>
          <Text style={[styles.reset, { color: theme.accent }]}>Reset Auto-Download Settings</Text>
        </TouchableOpacity>
        
        {/* Save to Gallery */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Save to Gallery</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Private Chats</Text>
          <Switch
            value={dataAndStorageSettings.saveToGalleryPrivate}
            onValueChange={v => updateDataAndStorageSetting('saveToGalleryPrivate', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Groups</Text>
          <Switch
            value={dataAndStorageSettings.saveToGalleryGroups}
            onValueChange={v => updateDataAndStorageSetting('saveToGalleryGroups', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Channels</Text>
          <Switch
            value={dataAndStorageSettings.saveToGalleryChannels}
            onValueChange={v => updateDataAndStorageSetting('saveToGalleryChannels', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
        
        {/* Streaming */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>Streaming</Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Stream Videos and Audio Files</Text>
          <Switch
            value={dataAndStorageSettings.streaming}
            onValueChange={v => updateDataAndStorageSetting('streaming', v)}
            thumbColor={theme.accent}
            trackColor={{ true: '#ffd6d6', false: '#ccc' }}
          />
        </View>
      </ScrollView>

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
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 16, marginTop: 24, marginBottom: 8, fontWeight: '600' },
  sectionDescription: { fontSize: 14, marginBottom: 16, lineHeight: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  label: { fontSize: 15 },
  reset: { marginTop: 12, marginBottom: 8 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadedFilesSection: {
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  fileName: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default DataAndStorageScreen; 