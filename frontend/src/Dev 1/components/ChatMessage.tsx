import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSettings } from '../SettingsContext';

interface ChatMessageProps {
  message: string;
  isReply?: boolean;
  sender?: string;
  timestamp?: string;
  style?: any;
  messageType?: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

const { width } = Dimensions.get('window');

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isReply = false, 
  sender, 
  timestamp, 
  style,
  messageType = 'text',
  mediaUrl
}) => {
  const { chatSettings } = useSettings();

  const renderContent = () => {
    switch (messageType) {
      case 'image':
        return (
          <Image 
            source={{ uri: mediaUrl || message }} 
            style={styles.mediaImage}
            resizeMode="cover"
          />
        );
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Text style={styles.videoText}>📹 Video Message</Text>
            <Text style={styles.videoUrl}>{mediaUrl || message}</Text>
          </View>
        );
      default:
        return (
          <Text style={[styles.messageText, { fontSize: chatSettings.messageSize }]}>
            {message}
          </Text>
        );
    }
  };

  if (isReply) {
    return (
      <View style={[styles.replyContainer, { borderRadius: chatSettings.messageCorner }, style]}>
        {renderContent()}
      </View>
    );
  }

  return (
    <View style={styles.messageContainer}>
      {sender && (
        <Text style={styles.sender}>{sender}</Text>
      )}
      {renderContent()}
      {timestamp && (
        <Text style={styles.timestamp}>{timestamp}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 2,
  },
  messageText: {
    color: '#000',
  },
  replyContainer: {
    backgroundColor: '#b388ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  replyText: {
    color: '#fff',
  },
  sender: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  mediaImage: {
    width: Math.min(width * 0.6, 300),
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
  videoContainer: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 4,
  },
  videoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoUrl: {
    fontSize: 12,
    color: '#666',
  },
});

export default ChatMessage; 