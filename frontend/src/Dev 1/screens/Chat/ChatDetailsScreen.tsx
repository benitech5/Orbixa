import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ActionSheetIOS,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Linking,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, RootStackParamList } from '../../types/navigation';
import { useSettings } from '../../SettingsContext';
import { useAppSelector } from '../../store/store';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MediaPicker from '../../components/MediaPicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

type ChatRoomNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainStackParamList, 'ChatRoom'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ChatRoomScreenProps {
  navigation: ChatRoomNavigationProp;
  route: {
    params: {
      chatId: string;
      chatName: string;
    };
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice' | 'location';
  isMine: boolean;
  voiceDuration?: number;
  location?: LocationData;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing?',
    senderId: 'other',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text',
    isMine: false,
  },
  {
    id: '2',
    content: 'I\'m doing great! Thanks for asking. How about you?',
    senderId: 'me',
    senderName: 'Me',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text',
    isMine: true,
  },
  {
    id: '3',
    content: 'Pretty good! Working on some exciting projects.',
    senderId: 'other',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 2400000),
    type: 'text',
    isMine: false,
  },
  {
    id: '4',
    content: 'That sounds interesting! What kind of projects?',
    senderId: 'me',
    senderName: 'Me',
    timestamp: new Date(Date.now() - 1800000),
    type: 'text',
    isMine: true,
  },
];

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ navigation, route }) => {
  const { chatId, chatName } = route.params;
  const { theme } = useSettings();
  const { chatSettings } = useSettings();
  const user = useAppSelector((state) => state.auth.user);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState<any>(null);
  const [recordingPermission, setRecordingPermission] = useState<string | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Location states
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  // Load messages from AsyncStorage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`chat_messages_${chatId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([]);
        }
      } catch (e) {
        setMessages([]);
      }
    };
    loadMessages();
  }, [chatId]);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(`chat_messages_${chatId}`,
        JSON.stringify(messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp ? msg.timestamp.toISOString() : null
        })))
      );
    }
  }, [messages, chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://10.132.219.185:8082/api/messages/chat/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } });
        setMessages(response.data.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp && !isNaN(Date.parse(msg.timestamp)) ? new Date(msg.timestamp) : null,
          isMine: msg.senderId === user?.userId
        })));
      } catch (e) {
        setError('Failed to load messages');
        const stored = await AsyncStorage.getItem(`chat_messages_${chatId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setMessages([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      // For now, we'll simulate permission granted
      setRecordingPermission('granted');
      setLocationPermission('granted');
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: chatName,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              setMenuVisible(true);
            }}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, chatName, theme]);

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant location permission to share your location.');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0] 
        ? `${addressResponse[0].street || ''} ${addressResponse[0].city || ''} ${addressResponse[0].region || ''}`
        : 'Unknown location';

      return { latitude, longitude, address };
    } catch (error) {
      console.log('Error getting location:', error);
      return null;
    }
  };

  const openGoogleMaps = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        const { latitude, longitude } = location;
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Google Maps is not available on this device');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open Google Maps');
    }
  };

  const sendLocationMessage = async () => {
    try {
      const location = await getCurrentLocation();
      if (!location) {
        Alert.alert('Error', 'Unable to get your current location');
        return;
      }

      const message = {
        content: `📍 ${location.address || 'My Location'}`,
        senderId: user?.id,
        senderName: user?.name || 'Me',
        timestamp: new Date().toISOString(),
        type: 'location',
        location: location,
      };

      try {
        const token = await AsyncStorage.getItem('token');
        await axios.post(`http://10.132.219.185:8082/api/messages/chat/${chatId}`, message, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      } catch (e) {
        Alert.alert('Error', 'Failed to send location to backend. Message will be saved locally.');
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send location');
    }
  };

  const openLocationInMaps = (location: LocationData) => {
    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Failed to open location in maps');
    });
  };

  const startRecording = async () => {
    if (recordingPermission !== 'granted') {
      Alert.alert('Permission needed', 'Please grant microphone permission to record voice notes.');
      return;
    }

    try {
      // Simulate recording start
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Animate slide
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      // Reset animation
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (uri && recordingDuration > 0) {
        await sendVoiceMessage(uri, recordingDuration);
      }
      
      setRecordingDuration(0);
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      // Reset animation
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setRecordingDuration(0);
    } catch (err) {
      console.log('Error canceling recording:', err);
    }
  };

  const sendVoiceMessage = async (uri: string, duration: number) => {
    const message = {
      content: uri,
      senderId: user?.id,
      senderName: user?.name || 'Me',
      timestamp: new Date().toISOString(),
      type: 'voice',
      voiceDuration: duration,
    };

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://10.132.219.185:8082/api/messages/chat/${chatId}`, message, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [
        { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
        ...prev
      ]);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    } catch (e) {
      Alert.alert('Error', 'Failed to send voice message to backend. Message will be saved locally.');
      setMessages(prev => [
        { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
        ...prev
      ]);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        content: newMessage.trim(),
        senderId: user?.id,
        senderName: user?.name || 'Me',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.post(`http://10.132.219.185:8082/api/messages/chat/${chatId}`, message, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setNewMessage('');
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      } catch (e) {
        Alert.alert('Error', 'Failed to send message to backend. Message will be saved locally.');
        setMessages(prev => [
          { ...message, id: Date.now().toString(), isMine: true, timestamp: new Date() },
          ...prev
        ]);
        setNewMessage('');
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    }
  };

  const reactToMessage = async (messageId: any, reaction: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://192.168.96.216:8082/api/messages/${messageId}/react`, null, {
        params: { reaction },
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  };

  const editMessage = async (messageId: any, updatedContent: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://192.168.96.216:8082/api/messages/${messageId}`, { content: updatedContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  };

  const deleteMessage = async (messageId: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.96.216:8082/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow,
      item.isMine ? styles.myMessageRow : styles.theirMessageRow
    ]}>
      <View style={[
        styles.messageBubble,
        { borderRadius: chatSettings.messageCorner },
        item.isMine
          ? { backgroundColor: '#e53935' }
          : { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border }
      ]}>
        {item.type === 'voice' ? (
          <View style={styles.voiceMessageContainer}>
            <TouchableOpacity style={styles.voicePlayButton}>
              <Ionicons name="play" size={20} color={item.isMine ? '#fff' : theme.text} />
            </TouchableOpacity>
            <View style={styles.voiceWaveform}>
              {/* Voice waveform visualization would go here */}
              <View style={[styles.voiceBar, { backgroundColor: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]} />
              <View style={[styles.voiceBar, { backgroundColor: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]} />
              <View style={[styles.voiceBar, { backgroundColor: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]} />
              <View style={[styles.voiceBar, { backgroundColor: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]} />
              <View style={[styles.voiceBar, { backgroundColor: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]} />
            </View>
            <Text style={[styles.voiceDuration, { color: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]}>
              {item.voiceDuration ? formatDuration(item.voiceDuration) : '0:00'}
            </Text>
          </View>
        ) : item.type === 'location' ? (
          <TouchableOpacity 
            style={styles.locationMessageContainer}
            onPress={() => item.location && openLocationInMaps(item.location)}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={24} color={item.isMine ? '#fff' : '#DC143C'} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={[
                styles.locationTitle,
                { color: item.isMine ? '#fff' : theme.text }
              ]}>
                Location
              </Text>
              <Text style={[
                styles.locationAddress,
                { color: item.isMine ? 'rgba(255,255,255,0.8)' : theme.subtext }
              ]}>
                {item.content.replace('📍 ', '')}
              </Text>
              <Text style={[
                styles.locationTap,
                { color: item.isMine ? 'rgba(255,255,255,0.6)' : theme.subtext }
              ]}>
                Tap to open in maps
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={[
            styles.messageText,
            { fontSize: chatSettings.messageSize },
            item.isMine ? { color: '#fff' } : { color: theme.text }
          ]}>
            {item.content}
          </Text>
        )}
        <Text style={[styles.messageTime, { color: item.isMine ? 'rgba(255,255,255,0.7)' : theme.subtext }]}>
          {item.timestamp ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
      </View>
    </View>
  );

  const renderInputBar = () => {
    return (
      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}> 
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={() => setShowMediaPicker(!showMediaPicker)}
        >
          <Ionicons name={showMediaPicker ? "close" : "add"} size={24} color={theme.text} />
        </TouchableOpacity>
        
        {!isRecording ? (
          <>
            <TextInput
              style={[styles.textInput, { 
                borderColor: theme.border, 
                backgroundColor: theme.background,
                color: theme.text 
              }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.subtext}
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline={false}
              onFocus={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={newMessage.trim() ? sendMessage : startRecording}
            >
              <Ionicons 
                name={newMessage.trim() ? "send" : "mic"} 
                size={24} 
                color={newMessage.trim() ? theme.accent : '#DC143C'} 
              />
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View 
            style={[
              styles.recordingContainer,
              {
                transform: [{
                  translateX: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  })
                }]
              }
            ]}
          >
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
              <Text style={styles.recordingDuration}>{formatDuration(recordingDuration)}</Text>
            </View>
            <View style={styles.recordingActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={cancelRecording}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.stopButton}
                onPress={stopRecording}
              >
                <Ionicons name="stop" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.safeArea, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            // TODO: Load older messages
          }}
          onEndReachedThreshold={0.1}
        />
        
        {showMediaPicker && (
          <View style={styles.mediaPickerContainer}>
            <View style={styles.mediaPickerContent}>
              <TouchableOpacity 
                style={styles.mediaOption}
                onPress={() => {
                  setShowMediaPicker(false);
                  sendLocationMessage();
                }}
              >
                <View style={styles.mediaIconContainer}>
                  <Ionicons name="location" size={24} color="#DC143C" />
                </View>
                <Text style={styles.mediaOptionText}>Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.mediaOption}
                onPress={() => {
                  setShowMediaPicker(false);
                  openGoogleMaps();
                }}
              >
                <View style={styles.mediaIconContainer}>
                  <Ionicons name="map" size={24} color="#DC143C" />
                </View>
                <Text style={styles.mediaOptionText}>Open Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {renderInputBar()}
      </KeyboardAvoidingView>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(199, 25, 25, 0.3)' }} />
        </TouchableWithoutFeedback>
        <View style={{ position: 'absolute', top: 60, right: 20, backgroundColor: '#fff', borderRadius: 8, elevation: 5, minWidth: 200 }}>
          {[
            { label: 'View contact', screen: 'ContactProfile' },
            { label: 'Search', screen: 'SearchScreen' },
            { label: 'New group', screen: 'New Group' },
            { label: 'Media, links, and docs', screen: 'MediaSharedScreen' },
            { label: 'Chat theme', screen: 'ChatSettingsScreen' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={{ padding: 16, borderBottomWidth: idx < 4 ? 1 : 0, borderBottomColor: '#eee' }}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate(item.screen);
              }}
            >
              <Text style={{ color: '#222', fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{ padding: 16 }}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    marginBottom: 10,
  },
  messageText: {},
  messageTime: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },
  voicePlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 32,
    marginRight: 8,
  },
  voiceBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  voiceDuration: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
    paddingVertical: 4,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationTap: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  mediaPickerContainer: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  mediaPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mediaOption: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mediaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediaOptionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    paddingBottom: 15,
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 0,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    alignSelf: 'center',
    padding: 8,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DC143C',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 8,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  recordingDuration: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stopButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatRoomScreen; 