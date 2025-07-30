import React, { useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { Message } from '../types/Message';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'video' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type,
      senderId: 'currentUser',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      mediaUrl: type !== 'text' ? content : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatMessage
      message={item.content}
      sender={item.senderName}
      timestamp={new Date(item.timestamp).toLocaleTimeString()}
      messageType={item.type}
      mediaUrl={item.mediaUrl}
      isReply={item.isReply}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        inverted={false}
      />
      <ChatInput onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
});

export default ChatScreen; 