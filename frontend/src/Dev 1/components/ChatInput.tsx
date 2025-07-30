import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MediaPicker from './MediaPicker';

interface ChatInputProps {
  onSendMessage: (message: string, type?: 'text' | 'image' | 'video') => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type a message..." 
}) => {
  const [message, setMessage] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleMediaSelected = (url: string, type: 'image' | 'video') => {
    onSendMessage(url, type);
    setShowMediaPicker(false);
  };

  const toggleMediaPicker = () => {
    setShowMediaPicker(!showMediaPicker);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {showMediaPicker && (
        <MediaPicker onMediaSelected={handleMediaSelected} />
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.mediaButton} 
          onPress={toggleMediaPicker}
        >
          <Ionicons 
            name={showMediaPicker ? "close" : "add"} 
            size={24} 
            color="#007AFF" 
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message.trim() ? "#007AFF" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
  },
  mediaButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  sendButtonDisabled: {
    backgroundColor: '#f8f8f8',
  },
});

export default ChatInput; 