import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MediaPickerProps {
  onMediaSelected?: (url: string, type: string) => void;
}

const MediaPicker: React.FC<MediaPickerProps> = ({ onMediaSelected }) => {
  const handleGalleryPress = () => {
    // For now, just show an alert - no navigation
    Alert.alert('Gallery', 'Gallery feature coming soon!');
  };

  const handleFilePress = () => {
    // For now, just show an alert - no navigation
    Alert.alert('File', 'File upload feature coming soon!');
  };

  const handleLocationPress = () => {
    // For now, just show an alert - no navigation
    Alert.alert('Location', 'Location sharing feature coming soon!');
  };

  const handleMusicPress = () => {
    // For now, just show an alert - no navigation
    Alert.alert('Music', 'Music sharing feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleGalleryPress}>
          <View style={[styles.iconContainer, { backgroundColor: '#007AFF' }]}>
            <Ionicons name="images" size={24} color="white" />
          </View>
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleFilePress}>
          <View style={[styles.iconContainer, { backgroundColor: '#34C759' }]}>
            <Ionicons name="document" size={24} color="white" />
          </View>
          <Text style={styles.buttonText}>File</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleLocationPress}>
          <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
            <Ionicons name="location" size={24} color="white" />
          </View>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleMusicPress}>
          <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
            <Ionicons name="musical-notes" size={24} color="white" />
          </View>
          <Text style={styles.buttonText}>Music</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default MediaPicker; 